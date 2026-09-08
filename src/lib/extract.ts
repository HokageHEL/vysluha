import { fullNameGenitive, rankGenitive } from "./genitive";
import {
  ServiceEvent,
  ServiceExtractPerson,
  ServiceRecord,
  SignatureBlock,
} from "./types";

export function formatUaDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}.${m}.${y}`;
}

const MONTHS_GENITIVE = [
  "січня",
  "лютого",
  "березня",
  "квітня",
  "травня",
  "червня",
  "липня",
  "серпня",
  "вересня",
  "жовтня",
  "листопада",
  "грудня",
];

// «19 березня 2014 року» — так дати пишуть у рядках-подіях
export function formatUaDateWords(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const month = MONTHS_GENITIVE[Number(m) - 1];
  if (!month) return formatUaDate(iso);
  return `${Number(d)} ${month} ${y} року`;
}

// Ліва колонка таблиці: дві дати одна під одною, «по т.ч.» замість порожньої
export function periodDates(record: {
  startDate: string;
  endDate: string;
}): [string, string] {
  return [
    formatUaDate(record.startDate),
    record.endDate ? formatUaDate(record.endDate) : "по т.ч.",
  ];
}

// Компактний вигляд періоду для службових таблиць застосунку
export function formatPeriod(record: {
  startDate: string;
  endDate: string;
}): string {
  return periodDates(record).join(" – ");
}

export function formatPlaceLine(record: ServiceRecord): string {
  return [record.position, record.place].filter(Boolean).join(", ");
}

// Рядок «звання + ПІБ у родовому відмінку», який показує форма і друкує витяг.
// Автоматика — лише підказка: збережена ручна правка завжди має пріоритет.
export function buildPersonLine(person: ServiceExtractPerson): string {
  if (person.headerOverride.trim()) return person.headerOverride;
  return suggestPersonLine(person);
}

export function suggestPersonLine(person: ServiceExtractPerson): string {
  return [rankGenitive(person.militaryRank), fullNameGenitive(person)]
    .filter(Boolean)
    .join(" ");
}

// Перший рядок шапки: «майора ІВАНЕНКА Івана Івановича, 1985 р.н.»
export function buildHeaderName(person: ServiceExtractPerson): string {
  const line = buildPersonLine(person);
  const birth = person.birthYear.trim();
  if (!birth) return line;
  return line ? `${line}, ${birth} р.н.` : `${birth} р.н.`;
}

// Другий рядок шапки: «0000000000, у Збройних Силах України – з 01.01.2015 р. по т.ч.»
export function buildHeaderService(person: ServiceExtractPerson): string {
  const start = formatUaDate(person.serviceStartDate);
  const end = person.serviceEndDate
    ? `по ${formatUaDate(person.serviceEndDate)} р.`
    : "по т.ч.";
  const span = start
    ? `у Збройних Силах України – з ${start} р. ${end}`
    : "у Збройних Силах України";
  const taxId = person.taxId.trim();
  return taxId ? `${taxId}, ${span}` : span;
}

// Порожні рядки не друкуємо, але й не схлопуємо абзаци всередині тексту
export const splitLines = (text: string): string[] =>
  text.split("\n").map((line) => line.trim()).filter(Boolean);

export type ExtractRow =
  | { kind: "event"; index: number; event: ServiceEvent }
  | { kind: "period"; index: number; record: ServiceRecord };

// Періоди й події зливаються в один хронологічний список.
// Подія з датою всередині періоду стає рядком одразу після нього,
// а подія в день початку періоду — перед ним (як у друкованому витягу).
export function buildExtractRows(
  records: ServiceRecord[],
  events: ServiceEvent[],
): ExtractRow[] {
  const items = [
    ...events.map((event, index) => ({
      date: event.date,
      order: 0,
      row: { kind: "event", index, event } as ExtractRow,
    })),
    ...records.map((record, index) => ({
      date: record.startDate,
      order: 1,
      row: { kind: "period", index, record } as ExtractRow,
    })),
  ];

  // Рядок без дати ще не має місця в документі — тримаємо його в кінці,
  // там, де його щойно додали, а не на початку списку
  const key = (date: string) => date || "9999-99-99";

  return items
    .map((item, seq) => ({ ...item, seq }))
    .sort(
      (a, b) =>
        key(a.date).localeCompare(key(b.date)) ||
        a.order - b.order ||
        a.seq - b.seq,
    )
    .map((item) => item.row);
}

// Порожні поля підвалу друкуються підказкою в дужках — щоб витяг не пішов
// із чужим підписом і щоб одразу було видно, що саме треба виправити
const hint = (text: string) => `[ ${text} ]`;

export interface SignatureLines {
  positionLines: string[];
  rank: string;
  name: string;
  executor: string;
  incomplete: boolean;
}

export function buildSignatureLines(signature: SignatureBlock): SignatureLines {
  const positionLines = splitLines(signature.positionLines);
  const executor = [signature.executor.trim(), signature.executorPhone.trim()]
    .filter(Boolean)
    .join(" ");
  return {
    positionLines: positionLines.length
      ? positionLines
      : [hint("посада того, хто підписує витяг")],
    // звання зліва і прізвище справа, між ними лишається місце для підпису
    rank: signature.rank.trim() || hint("звання"),
    name: signature.name.trim() || hint("Ім'я ПРІЗВИЩЕ"),
    executor: executor || hint("виконавець, телефон"),
    incomplete:
      positionLines.length === 0 ||
      !signature.rank.trim() ||
      !signature.name.trim() ||
      !executor,
  };
}

export const extractFileName = (person: ServiceExtractPerson): string =>
  [person.lastName, person.firstName, person.middleName]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ") || "витяг";
