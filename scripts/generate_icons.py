import zlib
import struct
import math
import os

def create_png(width, height, rgba_data):
    def chunk(chunk_type, data):
        c = chunk_type + data
        crc = zlib.crc32(c) & 0xffffffff
        return struct.pack(">I", len(data)) + c + struct.pack(">I", crc)

    header = b"\x89PNG\r\n\x1a\n"
    ihdr = chunk(b"IHDR", struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0))

    raw = bytearray()
    for y in range(height):
        raw.append(0)  # Filter type None
        raw.extend(rgba_data[y * width * 4 : (y + 1) * width * 4])

    idat = chunk(b"IDAT", zlib.compress(bytes(raw), 9))
    iend = chunk(b"IEND", b"")
    return header + ihdr + idat + iend

def point_to_segment_dist_sq(px, py, x1, y1, x2, y2):
    dx = x2 - x1
    dy = y2 - y1
    l2 = dx * dx + dy * dy
    if l2 == 0:
        return (px - x1) ** 2 + (py - y1) ** 2
    t = max(0.0, min(1.0, ((px - x1) * dx + (py - y1) * dy) / l2))
    proj_x = x1 + t * dx
    proj_y = y1 + t * dy
    return (px - proj_x) ** 2 + (py - proj_y) ** 2

def render_logo(size):
    # Supersample 4x for smooth anti-aliasing
    scale = 4
    sw = size * scale
    sh = size * scale

    # SVG is 32x32:
    # rect: width=32, height=32, rx=7, fill=#FFB54D
    # chevron: M8.5 20.5 16 11.5l7.5 9, stroke=#201C17, stroke-width=3.4
    bg_color = (255, 181, 77)
    stroke_color = (32, 28, 23)

    rx = 7.0 / 32.0 * sw
    stroke_radius = (3.4 / 32.0 * sw) / 2.0
    stroke_radius_sq = stroke_radius * stroke_radius

    # Segment points
    p1 = (8.5 / 32.0 * sw, 20.5 / 32.0 * sw)
    p2 = (16.0 / 32.0 * sw, 11.5 / 32.0 * sw)
    p3 = (23.5 / 32.0 * sw, 20.5 / 32.0 * sw)

    # Temporary grid for supersampling
    sub_grid = [[(0, 0, 0, 0) for _ in range(sw)] for _ in range(sh)]

    for sy in range(sh):
        py = sy + 0.5
        for sx in range(sw):
            px = sx + 0.5

            # Check inside rounded rect [0, sw] x [0, sh] with radius rx
            inside_rect = False
            if (rx <= px <= sw - rx) or (rx <= py <= sh - rx):
                inside_rect = (0 <= px <= sw) and (0 <= py <= sh)
            else:
                # Corner centers
                cx = rx if px < rx else sw - rx
                cy = rx if py < rx else sh - rx
                if (px - cx) ** 2 + (py - cy) ** 2 <= rx * rx:
                    inside_rect = True

            if not inside_rect:
                sub_grid[sy][sx] = (0, 0, 0, 0)
                continue

            # Check inside chevron stroke
            d1 = point_to_segment_dist_sq(px, py, p1[0], p1[1], p2[0], p2[1])
            d2 = point_to_segment_dist_sq(px, py, p2[0], p2[1], p3[0], p3[1])
            if min(d1, d2) <= stroke_radius_sq:
                sub_grid[sy][sx] = (*stroke_color, 255)
            else:
                sub_grid[sy][sx] = (*bg_color, 255)

    # Downsample back to (size, size)
    out = bytearray(size * size * 4)
    total_samples = scale * scale
    for y in range(size):
        for x in range(size):
            r = g = b = a = 0
            for dy in range(scale):
                for dx in range(scale):
                    sr, sg, sb, sa = sub_grid[y * scale + dy][x * scale + dx]
                    r += sr * sa
                    g += sg * sa
                    b += sb * sa
                    a += sa
            if a > 0:
                out_r = int(r / a)
                out_g = int(g / a)
                out_b = int(b / a)
                out_a = int(a / total_samples)
            else:
                out_r = out_g = out_b = out_a = 0
            idx = (y * size + x) * 4
            out[idx] = out_r
            out[idx + 1] = out_g
            out[idx + 2] = out_b
            out[idx + 3] = out_a

    return create_png(size, size, out)

def create_ico(png_list):
    # png_list: list of (size, png_bytes)
    count = len(png_list)
    header = struct.pack("<HHH", 0, 1, count)
    offset = 6 + count * 16
    entries = bytearray()
    data = bytearray()

    for size, png_data in png_list:
        w = size if size < 256 else 0
        h = size if size < 256 else 0
        data_len = len(png_data)
        entries.extend(struct.pack("<BBBBHHII", w, h, 0, 0, 1, 32, data_len, offset))
        data.extend(png_data)
        offset += data_len

    return header + bytes(entries) + bytes(data)

def main():
    os.makedirs("build", exist_ok=True)
    os.makedirs("src-tauri/icons", exist_ok=True)

    sizes = [16, 32, 48, 64, 128, 256]
    pngs = {}
    for s in sizes:
        print(f"Rendering {s}x{s}...")
        pngs[s] = render_logo(s)

    # 512 for main build icon
    print("Rendering 512x512...")
    png_512 = render_logo(512)

    # Write Electron icons
    with open("build/icon.png", "wb") as f:
        f.write(png_512)

    ico_data = create_ico([(16, pngs[16]), (32, pngs[32]), (48, pngs[48]), (64, pngs[64]), (128, pngs[128]), (256, pngs[256])])
    with open("build/icon.ico", "wb") as f:
        f.write(ico_data)

    # Write Tauri icons
    with open("src-tauri/icons/32x32.png", "wb") as f:
        f.write(pngs[32])
    with open("src-tauri/icons/128x128.png", "wb") as f:
        f.write(pngs[128])
    with open("src-tauri/icons/128x128@2x.png", "wb") as f:
        f.write(pngs[256])
    with open("src-tauri/icons/icon.png", "wb") as f:
        f.write(png_512)
    with open("src-tauri/icons/icon.ico", "wb") as f:
        f.write(ico_data)

    print("Icons generated successfully!")

if __name__ == "__main__":
    main()
