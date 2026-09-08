import {
  buildExtractRows,
  buildHeaderName,
  buildHeaderService,
  buildSignatureLines,
  extractFileName,
  periodDates,
  splitLines,
} from "./extract";
import {
  ServiceEvent,
  ServiceExtractPerson,
  ServiceRecord,
  SignatureBlock,
} from "./types";

// A4, поля 2 / 3 / 2 / 1 см — як у зразку витягу. Одиниця — twip (1/1440 дюйма).
const PAGE = { width: 11906, height: 16838 };
const MARGIN = { top: 1134, bottom: 1134, left: 1701, right: 567 };
const CONTENT_WIDTH = PAGE.width - MARGIN.left - MARGIN.right; // 9638
const COLUMN_WIDTHS = [1985, 5273, 2380]; // терміни / посада / місце

const FONT = "Times New Roman";
const SIZE = 28; // 14 pt, у півпунктах
const SMALL = 12; // 6 pt — рядок виконавця

export interface ExtractDocument {
  person: ServiceExtractPerson;
  records: ServiceRecord[];
  events: ServiceEvent[];
  signature: SignatureBlock;
}

export async function exportServiceRecordWord({
  person,
  records,
  events,
  signature,
}: ExtractDocument): Promise<void> {
  // docx — важка бібліотека, вантажимо її лише в момент експорту
  const [
    {
      AlignmentType,
      BorderStyle,
      Document,
      Packer,
      Paragraph,
      Tab,
      TabStopType,
      Table,
      TableCell,
      TableRow,
      TextRun,
      VerticalAlign,
      WidthType,
    },
    { saveAs },
  ] = await Promise.all([import("docx"), import("file-saver")]);

  type Options = {
    bold?: boolean;
    underline?: boolean;
    align?: (typeof AlignmentType)[keyof typeof AlignmentType];
    size?: number;
  };

  const line = (text: string, options: Options = {}) =>
    new Paragraph({
      alignment: options.align ?? AlignmentType.LEFT,
      children: [
        new TextRun({
          text,
          font: FONT,
          size: options.size ?? SIZE,
          bold: options.bold,
          underline: options.underline ? {} : undefined,
        }),
      ],
    });

  const border = { style: BorderStyle.SINGLE, size: 4, color: "000000" };
  const borders = { top: border, bottom: border, left: border, right: border };

  const cell = (
    children: InstanceType<typeof Paragraph>[],
    width: number,
    columnSpan?: number,
  ) =>
    new TableCell({
      borders,
      width: { size: width, type: WidthType.DXA },
      columnSpan,
      verticalAlign: VerticalAlign.CENTER,
      margins: { left: 108, right: 108 },
      children,
    });

  const headerRow = new TableRow({
    tableHeader: true,
    children: [
      "Терміни проходження служби",
      "Займана посада",
      "Місце проходження служби",
    ].map((text, i) =>
      cell(
        [line(text, { bold: true, align: AlignmentType.CENTER })],
        COLUMN_WIDTHS[i],
      ),
    ),
  });

  const bodyRows = buildExtractRows(records, events).map((row) => {
    if (row.kind === "event") {
      return new TableRow({
        children: [
          cell(
            splitLines(row.event.text).map((text) =>
              line(text, { align: AlignmentType.CENTER }),
            ),
            CONTENT_WIDTH,
            3,
          ),
        ],
      });
    }

    const [start, end] = periodDates(row.record);
    return new TableRow({
      children: [
        cell(
          [start, end].map((text) =>
            line(text, { align: AlignmentType.CENTER }),
          ),
          COLUMN_WIDTHS[0],
        ),
        cell(
          [line(row.record.position, { align: AlignmentType.JUSTIFIED })],
          COLUMN_WIDTHS[1],
        ),
        cell(
          [line(row.record.place, { align: AlignmentType.CENTER })],
          COLUMN_WIDTHS[2],
        ),
      ],
    });
  });

  const sign = buildSignatureLines(signature);

  const doc = new Document({
    sections: [
      {
        properties: {
          page: { size: PAGE, margin: MARGIN },
        },
        children: [
          line("ВИТЯГ З ПОСЛУЖНОГО СПИСКУ", {
            bold: true,
            align: AlignmentType.CENTER,
          }),
          line("", { size: 16 }),
          line(buildHeaderName(person), {
            bold: true,
            underline: true,
            align: AlignmentType.CENTER,
          }),
          line(buildHeaderService(person), { align: AlignmentType.CENTER }),
          ...splitLines(person.contractNote).map((text) =>
            line(text, { align: AlignmentType.CENTER }),
          ),
          new Table({
            width: { size: CONTENT_WIDTH, type: WidthType.DXA },
            columnWidths: COLUMN_WIDTHS,
            rows: [headerRow, ...bodyRows],
          }),
          line(""),
          line(""),
          ...sign.positionLines.map((text) => line(text)),
          // Звання зліва, ПІБ справа — між ними лишається місце для підпису
          new Paragraph({
            tabStops: [{ type: TabStopType.RIGHT, position: CONTENT_WIDTH }],
            children: [
              new TextRun({ text: sign.rank, font: FONT, size: SIZE }),
              new TextRun({
                children: [new Tab(), sign.name],
                font: FONT,
                size: SIZE,
              }),
            ],
          }),
          line(""),
          line(""),
          line(sign.executor, { size: SMALL }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${extractFileName(person)}_витяг з послужного.docx`);
}

export async function exportServiceRecordExcel({
  person,
  records,
  events,
  signature,
}: ExtractDocument): Promise<void> {
  // xlsx — важка бібліотека, вантажимо її лише в момент експорту
  const [XLSX, { saveAs }] = await Promise.all([
    import("xlsx"),
    import("file-saver"),
  ]);

  const sign = buildSignatureLines(signature);
  const rows: string[][] = [
    ["ВИТЯГ З ПОСЛУЖНОГО СПИСКУ"],
    [buildHeaderName(person)],
    [buildHeaderService(person)],
    ...splitLines(person.contractNote).map((text) => [text]),
    [],
    ["Терміни проходження служби", "Займана посада", "Місце проходження служби"],
  ];

  // Рядки-події займають усю ширину таблиці — зливаємо їх клітинки
  const merges: { s: { r: number; c: number }; e: { r: number; c: number } }[] =
    [];

  for (const row of buildExtractRows(records, events)) {
    if (row.kind === "event") {
      merges.push({
        s: { r: rows.length, c: 0 },
        e: { r: rows.length, c: 2 },
      });
      rows.push([row.event.text]);
      continue;
    }
    rows.push([
      periodDates(row.record).join(" – "),
      row.record.position || "",
      row.record.place || "",
    ]);
  }

  rows.push([], ...sign.positionLines.map((text) => [text]), [
    sign.rank,
    "",
    sign.name,
  ], [], [sign.executor]);

  const worksheet = XLSX.utils.aoa_to_sheet(rows);
  worksheet["!cols"] = [{ wch: 24 }, { wch: 64 }, { wch: 28 }];
  worksheet["!merges"] = merges;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Послужний список");
  const data = XLSX.write(workbook, { type: "array", bookType: "xlsx" });
  saveAs(
    new Blob([data], { type: "application/octet-stream" }),
    `${extractFileName(person)}_витяг з послужного.xlsx`,
  );
}
