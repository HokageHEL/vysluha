import { ServiceRecord } from "./types";

export interface ServiceExtractPerson {
  fullName: string;
  militaryRank: string;
  position: string;
  unit: string;
}

export function formatUaDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

export function formatPeriod(record: {
  startDate: string;
  endDate: string;
}): string {
  const start = formatUaDate(record.startDate);
  const end = record.endDate ? formatUaDate(record.endDate) : "по т.ч.";
  return `${start} – ${end}`;
}

// Текст правої колонки витягу: «посада, місце служби»
export function formatPlaceLine(record: ServiceRecord): string {
  return [record.position, record.place].filter(Boolean).join(", ");
}

const lowerFirst = (s: string) =>
  s ? s.charAt(0).toLocaleLowerCase("uk") + s.slice(1) : s;

export function buildPersonLine(person: ServiceExtractPerson): string {
  const parts = [
    [person.militaryRank, person.fullName].filter(Boolean).join(" "),
    [
      lowerFirst(person.position),
      person.unit ? `військової частини ${person.unit}` : "",
    ]
      .filter(Boolean)
      .join(" "),
  ].filter(Boolean);
  return parts.join(", ");
}

export async function exportServiceRecordWord(
  person: ServiceExtractPerson,
  records: ServiceRecord[],
): Promise<void> {
  // docx — важка бібліотека, вантажимо її лише в момент експорту
  const [
    {
      AlignmentType,
      BorderStyle,
      Document,
      Packer,
      Paragraph,
      Table,
      TableCell,
      TableRow,
      TextRun,
      VerticalAlign,
      WidthType,
    },
    { saveAs },
  ] = await Promise.all([import("docx"), import("file-saver")]);

  const cellBorder = {
    style: BorderStyle.SINGLE,
    size: 4,
    color: "BFBFBF",
  } as const;

  const cellBorders = {
    top: cellBorder,
    bottom: cellBorder,
    left: cellBorder,
    right: cellBorder,
  };

  const rows = records.map(
    (record) =>
      new TableRow({
        children: [
          new TableCell({
            borders: cellBorders,
            width: { size: 32, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.TOP,
            margins: { left: 100, right: 100 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: formatPeriod(record),
                    font: "Times New Roman",
                    size: 24, // 12pt
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            borders: cellBorders,
            width: { size: 68, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            margins: { left: 100, right: 100 },
            children: [
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun({
                    text: formatPlaceLine(record),
                    font: "Times New Roman",
                    size: 24,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
  );

  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: "ВИТЯГ З ПОСЛУЖНОГО СПИСКУ",
                font: "Times New Roman",
                size: 28, // 14pt
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Paragraph({
            children: [
              new TextRun({
                text: buildPersonLine(person),
                font: "Times New Roman",
                size: 28,
                underline: {},
              }),
            ],
          }),
          new Paragraph({ text: "" }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${person.fullName}_витяг з послужного.docx`);
}

export async function exportServiceRecordExcel(
  person: ServiceExtractPerson,
  records: ServiceRecord[],
): Promise<void> {
  // xlsx — важка бібліотека, вантажимо її лише в момент експорту
  const [XLSX, { saveAs }] = await Promise.all([
    import("xlsx"),
    import("file-saver"),
  ]);

  const sheetData: (string | undefined)[][] = [
    ["ВИТЯГ З ПОСЛУЖНОГО СПИСКУ"],
    [],
    [buildPersonLine(person)],
    [],
    ...records.map((record) => [formatPeriod(record), formatPlaceLine(record)]),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  worksheet["!cols"] = [{ wch: 28 }, { wch: 90 }];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Послужний список");
  const data = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
  saveAs(
    new Blob([data], { type: "application/octet-stream" }),
    `${person.fullName}_витяг з послужного.xlsx`,
  );
}
