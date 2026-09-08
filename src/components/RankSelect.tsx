import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { MILITARY_RANK_GROUPS } from "@/lib/ranks";
import { cn } from "@/lib/utils";

interface RankSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

// Звання можна або ввести вручну, або обрати зі списку.
// Список не сортується — порядок у ranks.ts (за зростанням звання) зберігається.
export const RankSelect = ({
  id,
  value,
  onChange,
  placeholder,
}: RankSelectProps) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const query = value.trim().toLocaleLowerCase("uk");
  const groups = MILITARY_RANK_GROUPS.map((group) => ({
    label: group.label,
    ranks: group.ranks.filter((rank) =>
      rank.toLocaleLowerCase("uk").includes(query)
    ),
  })).filter((group) => group.ranks.length > 0);

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        id={id}
        value={value}
        placeholder={placeholder}
        autoComplete="off"
        className="pr-8"
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") setOpen(false);
        }}
      />
      <button
        type="button"
        tabIndex={-1}
        aria-label="Показати список звань"
        className="absolute right-0 top-0 flex h-10 w-8 items-center justify-center text-muted-foreground"
        onClick={() => setOpen((v) => !v)}
      >
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
        />
      </button>

      {open && groups.length > 0 && (
        <div className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          {groups.map((group) => (
            <div key={group.label}>
              <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                {group.label}
              </div>
              {group.ranks.map((rank) => (
                <button
                  key={rank}
                  type="button"
                  className={cn(
                    "block w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground",
                    rank === value.trim().toLocaleLowerCase("uk") &&
                      "bg-accent/50"
                  )}
                  onClick={() => {
                    onChange(rank);
                    setOpen(false);
                  }}
                >
                  {rank}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
