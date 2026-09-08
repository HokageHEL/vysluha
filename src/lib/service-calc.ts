import { ServiceExtraPeriod, ServiceRecord } from "./types";

// Максимум навчання, що зараховується до вислуги (п.2 Постанови КМУ № 393):
// до п'яти років, 1 рік навчання = 6 місяців служби
const STUDY_CAP_DAYS_360 = 5 * 360;

export function today(): string {
  return new Date().toISOString().split("T")[0];
}

function toEpochDay(iso: string): number | null {
  if (!iso) return null;
  const t = Date.parse(`${iso}T00:00:00Z`);
  if (Number.isNaN(t)) return null;
  return Math.floor(t / 86_400_000);
}

function epochDayToIso(day: number): string {
  return new Date(day * 86_400_000).toISOString().split("T")[0];
}

// Різниця дат у "пенсійному" форматі: 1 рік = 12 міс = 360 дн, 1 міс = 30 дн.
// endIso — виключно (день endIso вже не рахується)
function diffDays360(startIso: string, endIso: string): number {
  const [sy, sm, sd] = startIso.split("-").map(Number);
  const [ey, em, ed] = endIso.split("-").map(Number);
  let d = ed - sd;
  let m = em - sm;
  let y = ey - sy;
  if (d < 0) {
    d += 30;
    m -= 1;
  }
  if (m < 0) {
    m += 12;
    y -= 1;
  }
  return y * 360 + m * 30 + d;
}

export function formatDays360(totalDays: number): string {
  const rounded = Math.round(totalDays);
  const years = Math.floor(rounded / 360);
  const months = Math.floor((rounded % 360) / 30);
  const days = rounded % 30;
  const parts: string[] = [];
  if (years) parts.push(`${years} р.`);
  if (months) parts.push(`${months} міс.`);
  if (days || parts.length === 0) parts.push(`${days} дн.`);
  return parts.join(" ");
}

// Період включно з першим і останнім днем: 01.01.2021–03.01.2021 = 3 дні
interface EpochInterval {
  start: number; // включно
  endEx: number; // виключно (останній день + 1)
}

function toInterval(startDate: string, endDate: string): EpochInterval | null {
  const start = toEpochDay(startDate);
  const end = toEpochDay(endDate || today());
  if (start === null || end === null || end < start) return null;
  return { start, endEx: end + 1 };
}

// Тривалість одного періоду (включно з обома краями) у 360-форматі
export function periodDuration360(
  startDate: string,
  endDate: string
): number | null {
  const interval = toInterval(startDate, endDate);
  if (!interval) return null;
  return diffDays360(epochDayToIso(interval.start), epochDayToIso(interval.endEx));
}

export interface ServiceTotals {
  calendarTotal: number; // база ×1 (у днях 360)
  preferentialBonus: number; // надбавка ×2 понад календарну
  studyCounted: number; // зараховане навчання (×0,5)
  excluded: number; // дні, виключені періодами ×0
  studyCapped: boolean;
  grandTotal: number;
}

const EXTRA_COEFF: Record<ServiceExtraPeriod["coefficient"], number> = {
  preferential: 3,
  study: 0.5,
  none: 0,
};

/**
 * Посегментний розрахунок вислуги.
 * - Календарна вислуга (×1) — з періодів послужного списку, дні враховуються один раз
 *   навіть якщо періоди пересікаються.
 * - Додаткові періоди: при пересіканні з календарною днем володіє більший коефіцієнт.
 * - Періоди ×0 виключають дні повністю (СЗЧ тощо).
 */
export function computeServiceTotals(
  records: ServiceRecord[],
  extras: ServiceExtraPeriod[]
): ServiceTotals {
  const calendar = records
    .map((r) => toInterval(r.startDate, r.endDate))
    .filter((i): i is EpochInterval => i !== null);
  const extraIntervals = extras
    .map((e) => {
      const interval = toInterval(e.startDate, e.endDate);
      return interval ? { ...interval, coefficient: e.coefficient } : null;
    })
    .filter((i): i is EpochInterval & { coefficient: ServiceExtraPeriod["coefficient"] } => i !== null);

  const boundaries = Array.from(
    new Set([
      ...calendar.flatMap((i) => [i.start, i.endEx]),
      ...extraIntervals.flatMap((i) => [i.start, i.endEx]),
    ])
  ).sort((a, b) => a - b);

  const totals: ServiceTotals = {
    calendarTotal: 0,
    preferentialBonus: 0,
    studyCounted: 0,
    excluded: 0,
    studyCapped: false,
    grandTotal: 0,
  };
  let studyBaseUsed = 0;

  for (let i = 0; i < boundaries.length - 1; i++) {
    const [a, b] = [boundaries[i], boundaries[i + 1]];
    const inCalendar = calendar.some((iv) => iv.start <= a && b <= iv.endEx);
    const covering = extraIntervals.filter(
      (iv) => iv.start <= a && b <= iv.endEx
    );
    if (!inCalendar && covering.length === 0) continue;

    const seg = diffDays360(epochDayToIso(a), epochDayToIso(b));

    if (covering.some((iv) => iv.coefficient === "none")) {
      totals.excluded += seg;
      continue;
    }

    const eff = Math.max(
      inCalendar ? 1 : 0,
      ...covering.map((iv) => EXTRA_COEFF[iv.coefficient])
    );

    if (eff >= 1) {
      totals.calendarTotal += seg;
      totals.preferentialBonus += seg * (eff - 1);
    } else if (eff === 0.5) {
      const allowed = Math.max(
        0,
        Math.min(seg, STUDY_CAP_DAYS_360 - studyBaseUsed)
      );
      if (allowed < seg) totals.studyCapped = true;
      studyBaseUsed += allowed;
      totals.studyCounted += allowed / 2;
    }
  }

  totals.grandTotal =
    totals.calendarTotal + totals.preferentialBonus + totals.studyCounted;
  return totals;
}
