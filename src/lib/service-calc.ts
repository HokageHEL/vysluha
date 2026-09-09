import type { ServiceExtraPeriod, ServiceRecord } from "./types";
import { SERVICE_RULES, serviceRule } from "./service-rules";

const STUDY_CAP_DAYS_360 = 5 * 360;
const DAY_MS = 86_400_000;
export function today(): string {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}
function toEpochDay(iso: string): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const value = Date.parse(`${iso}T00:00:00Z`);
  if (!Number.isFinite(value) || new Date(value).toISOString().slice(0, 10) !== iso) return null;
  return value / DAY_MS;
}
interface EpochInterval { start: number; endEx: number }
function toInterval(startDate: string, endDate: string): EpochInterval | null {
  const start = toEpochDay(startDate);
  const end = toEpochDay(endDate);
  return start === null || end === null || end < start ? null : { start, endEx: end + 1 };
}

// Метод застосунку: повні календарні місяці + фактичний залишок днів.
// 30/360 використовується для підсумовування, а не для віднімання номерів днів.
// Постанова № 393 сама не визначає алгоритм арифметики неповних місяців.
function duration360({ start, endEx }: EpochInterval): number {
  const a = new Date(start * DAY_MS), b = new Date(endEx * DAY_MS);
  let months = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + b.getUTCMonth() - a.getUTCMonth();
  const anniversary = (count: number) => {
    const first = new Date(Date.UTC(a.getUTCFullYear(), a.getUTCMonth() + count, 1));
    const lastDay = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
    first.setUTCDate(Math.min(a.getUTCDate(), lastDay));
    return first.getTime() / DAY_MS;
  };
  if (anniversary(months) > endEx) months--;
  return months * 30 + endEx - anniversary(months);
}
function sumIntervals(intervals: EpochInterval[]): number {
  const merged: EpochInterval[] = [];
  for (const interval of [...intervals].sort((a, b) => a.start - b.start)) {
    const previous = merged[merged.length - 1];
    if (previous && interval.start <= previous.endEx) previous.endEx = Math.max(previous.endEx, interval.endEx);
    else merged.push({ ...interval });
  }
  return merged.reduce((sum, interval) => sum + duration360(interval), 0);
}
export function periodDuration360(startDate: string, endDate: string): number | null {
  const interval = toInterval(startDate, endDate || today());
  return interval ? duration360(interval) : null;
}
export function formatDays360(totalDays: number): string {
  // Зберігаємо дробові дні ×0,5 і ×4/3; не додаємо цілий день округленням.
  const whole = Math.floor(totalDays + 1e-9);
  const years = Math.floor(whole / 360), months = Math.floor((whole % 360) / 30);
  const days = Number((totalDays - years * 360 - months * 30).toFixed(6));
  const parts: string[] = [];
  if (years) parts.push(`${years} р.`);
  if (months) parts.push(`${months} міс.`);
  if (days || !parts.length) parts.push(`${days.toLocaleString("uk-UA", { maximumFractionDigits: 3 })} дн.`);
  return parts.join(" ");
}
export interface ServiceTotals {
  calendarTotal: number;
  preferentialBonus: number;
  studyCounted: number;
  excluded: number;
  studyCapped: boolean;
  appointmentTotal: number;
  grandTotal: number;
  warnings: string[];
}
export function computeServiceTotals(records: ServiceRecord[], extras: ServiceExtraPeriod[], asOf = today()): ServiceTotals {
  const totals: ServiceTotals = { calendarTotal: 0, preferentialBonus: 0, studyCounted: 0, excluded: 0, studyCapped: false, appointmentTotal: 0, grandTotal: 0, warnings: [] };
  const cutoff = toEpochDay(asOf);
  if (cutoff === null) { totals.warnings.push("Вкажіть коректну дату розрахунку."); return totals; }
  function read(start: string, end: string, label: string) {
    const interval = toInterval(start, end || asOf);
    if (!interval) { totals.warnings.push(`${label}: неповні або некоректні дати; період не враховано.`); return null; }
    if (interval.start > cutoff!) { totals.warnings.push(`${label}: початок пізніше дати розрахунку; період не враховано.`); return null; }
    return { start: interval.start, endEx: Math.min(interval.endEx, cutoff! + 1) };
  }
  const calendar = records.map((r, i) => read(r.startDate, r.endDate, `Служба №${i + 1}`)).filter((i): i is EpochInterval => i !== null);
  const extraIntervals = extras.flatMap((extra, index) => {
    const interval = read(extra.startDate, extra.endDate, `Додатковий період №${index + 1}`);
    const rule = serviceRule(extra.coefficient);
    if (!rule) totals.warnings.push(`Додатковий період №${index + 1}: невідомий коефіцієнт; не враховано.`);
    if (extra.coefficient === "study" && !extra.studyEligible) {
      totals.warnings.push(`Навчання №${index + 1}: підтвердьте відповідність умовам п. 2; поки не враховано.`);
      return [];
    }
    return interval && rule ? [{ ...interval, coefficient: extra.coefficient, factor: rule.factor }] : [];
  });
  const boundaries = [...new Set([...calendar, ...extraIntervals].flatMap((i) => [i.start, i.endEx]))].sort((a, b) => a - b);
  const base: EpochInterval[] = [], study: EpochInterval[] = [], excluded: EpochInterval[] = [];
  // Спільні частини пільг рахуються на об’єднанні періодів. Наприклад,
  // ×2 протягом місяця і ×3 в останній день: +30 днів та ще +1 день.
  // Розбиття місяця на окремі коефіцієнти порушує правило повного місяця.
  const bonusLevels = [...new Set(SERVICE_RULES.filter((rule) => rule.factor > 1)
    .map((rule) => Math.round((rule.factor - 1) * 6)))].sort((a, b) => a - b);
  const bonuses = new Map(bonusLevels.map((level) => [level, [] as EpochInterval[]]));
  for (let i = 0; i < boundaries.length - 1; i++) {
    const segment = { start: boundaries[i], endEx: boundaries[i + 1] };
    const covers = (iv: EpochInterval) => iv.start <= segment.start && segment.endEx <= iv.endEx;
    const inCalendar = calendar.some(covers);
    const covering = extraIntervals.filter(covers);
    if (covering.some((iv) => iv.factor === 0)) {
      if (inCalendar || covering.some((iv) => iv.factor > 0)) excluded.push(segment);
      continue;
    }
    const factor = Math.max(inCalendar ? 1 : 0, ...covering.map((iv) => iv.factor));
    if (factor >= 1) {
      base.push(segment);
      const bonusSixths = Math.round((factor - 1) * 6);
      for (const level of bonusLevels) {
        if (bonusSixths >= level) bonuses.get(level)!.push(segment);
      }
    } else if (factor === 0.5) study.push(segment);
  }
  totals.calendarTotal = sumIntervals(base);
  totals.excluded = sumIntervals(excluded);
  const studyDuration = sumIntervals(study);
  totals.studyCapped = studyDuration > STUDY_CAP_DAYS_360;
  totals.studyCounted = Math.min(studyDuration, STUDY_CAP_DAYS_360) / 2;
  // Шості частки дня точно представляють усі коефіцієнти постанови.
  totals.preferentialBonus = bonusLevels.reduce((sum, level, index) => {
    const increment = level - (bonusLevels[index - 1] || 0);
    return sum + sumIntervals(bonuses.get(level)!) * increment;
  }, 0) / 6;
  totals.appointmentTotal = totals.calendarTotal + totals.studyCounted;
  totals.grandTotal = totals.appointmentTotal + totals.preferentialBonus;
  return totals;
}
