// Модуль математичного розрахунку грошового забезпечення військовослужбовців ЗСУ
// Відповідає офіційному алгоритму соціального порталу МОУ (social.mil.gov.ua / calculator.mod.gov.ua)

import {
  ACADEMIC_RANK_OPTIONS,
  BRANCH_OPTIONS,
  CRYPTO_OPTIONS,
  DEFAULT_SUBSISTENCE_MINIMUM,
  DUTY_CONDITIONS,
  HONORARY_OPTIONS,
  MAX_REWARD_LIMIT_CAP,
  MED_CATEGORY_OPTIONS,
  MED_POSITION_OPTIONS,
  QUALIFICATION_OPTIONS,
  SALARY_RANKS,
  SCIENCE_DEGREE_OPTIONS,
  SECRECY_OPTIONS,
  SENIORITY_ALLOWANCES,
  SPORTS_OPTIONS,
  SSO_POSITIONS,
  TARIFF_GRADES,
} from "./salary-data";

export interface SalaryFormData {
  // Основне ГЗ
  rankIndex: number;
  tariffIndex: number;
  seniorityIndex: number;
  dutyMode: "default" | "custom";
  dutyConditionIndex: number;
  branchIndex: number;
  ssoPositionIndex: number;
  disciplineViolation: boolean;

  // Кваліфікація та надбавки
  hasSecrecy: boolean;
  secrecyIndex: number;
  secrecyDirectWork: boolean;

  hasQualification: boolean;
  qualificationIndex: number;
  medCategoryIndex: number;
  medPositionIndex: number;

  hasCrypto: boolean;
  cryptoIndex: number;

  hasHonoraryTitle: boolean;
  honoraryTitleIndex: number;

  hasSportsTitle: boolean;
  sportsTitleIndex: number;

  hasScienceDegree: boolean;
  scienceDegreeIndex: number;

  hasAcademicRank: boolean;
  academicRankIndex: number;

  subsistenceMinimum?: number;

  // Бойові та додаткові винагороди (воєнний стан)
  month: number; // 1-12
  year: number;

  cat170Enabled: boolean;
  cat170Days: number;
  cat70Enabled: boolean;
  cat70Days: number;

  dv100combatEnabled: boolean;
  dv100combatDays: number;
  dv30unitEnabled: boolean;
  dv30unitDays: number;
  cat50Enabled: boolean;
  cat50Days: number;

  instructorEnabled: boolean;
  insCommanderEnabled: boolean;
  insCommanderDays: number;
  insBasicEnabled: boolean;
  insBasicDays: number;
  insMediumEnabled: boolean;
  insMediumDays: number;
  insAdvancedEnabled: boolean;
  insAdvancedDays: number;
  insUbdEnabled: boolean;
  insUbdDays: number;

  absenceEnabled: boolean;
  absenceDays: number;

  stormRestoreEnabled: boolean;
  stormRestoreDays: number;
  stormCaptureEnabled: boolean;
  stormCaptureDays: number;

  prisonerCount: number;
  prisonerParticipants: number;
  destroyedCount: number;
  destroyedParticipants: number;
}

export const DEFAULT_SALARY_FORM_DATA: SalaryFormData = {
  rankIndex: 1, // Солдат, матрос
  tariffIndex: 0, // 1 розряд (2470 грн)
  seniorityIndex: 0, // До 1 року (0%)
  dutyMode: "default",
  dutyConditionIndex: 0, // 65%
  branchIndex: 0, // рядовий/офіцерський склад
  ssoPositionIndex: 0,
  disciplineViolation: false,

  hasSecrecy: false,
  secrecyIndex: 0,
  secrecyDirectWork: false,

  hasQualification: false,
  qualificationIndex: 0,
  medCategoryIndex: 0,
  medPositionIndex: 1,

  hasCrypto: false,
  cryptoIndex: 0,

  hasHonoraryTitle: false,
  honoraryTitleIndex: 0,

  hasSportsTitle: false,
  sportsTitleIndex: 0,

  hasScienceDegree: false,
  scienceDegreeIndex: 0,

  hasAcademicRank: false,
  academicRankIndex: 0,

  subsistenceMinimum: DEFAULT_SUBSISTENCE_MINIMUM,

  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),

  cat170Enabled: false,
  cat170Days: 0,
  cat70Enabled: false,
  cat70Days: 0,

  dv100combatEnabled: false,
  dv100combatDays: 0,
  dv30unitEnabled: false,
  dv30unitDays: 0,
  cat50Enabled: false,
  cat50Days: 0,

  instructorEnabled: false,
  insCommanderEnabled: false,
  insCommanderDays: 0,
  insBasicEnabled: false,
  insBasicDays: 0,
  insMediumEnabled: false,
  insMediumDays: 0,
  insAdvancedEnabled: false,
  insAdvancedDays: 0,
  insUbdEnabled: false,
  insUbdDays: 0,

  absenceEnabled: false,
  absenceDays: 0,

  stormRestoreEnabled: false,
  stormRestoreDays: 0,
  stormCaptureEnabled: false,
  stormCaptureDays: 0,

  prisonerCount: 0,
  prisonerParticipants: 1,
  destroyedCount: 0,
  destroyedParticipants: 1,
};

export interface SalaryCalculationResult {
  // Оклади
  ovz: number;
  baseSalary: number;

  // Відсотки та суми основного ГЗ
  seniorityPercent: number;
  seniorityBonus: number;

  nopsPercent: number;
  nopsBonus: number;

  premiumPercent: number;
  premiumAmount: number;

  ssoBonus: number;
  secrecyPercent: number;
  secrecyBonus: number;

  qualificationPercent: number;
  qualificationBonus: number;

  cryptoPercent: number;
  cryptoBonus: number;

  honoraryPercent: number;
  honoraryBonus: number;

  sportsPercent: number;
  sportsBonus: number;

  scienceDegreePercent: number;
  scienceDegreeBonus: number;

  academicRankPercent: number;
  academicRankBonus: number;

  monthlySalaryTotal: number;

  // Бойові та додаткові винагороди
  daysInMonth: number;
  calcMonth: number;
  calcYear: number;

  dv100combatDays: number;
  dv100combatAmount: number;

  dv30unitDays: number;
  dv30unitAmount: number;

  cat50Days: number;
  cat50Amount: number;

  cat170Days: number;
  cat170Amount: number;

  cat70Days: number;
  cat70Amount: number;

  insCommanderDays: number;
  insCommanderAmount: number;
  insBasicDays: number;
  insBasicAmount: number;
  insMediumDays: number;
  insMediumAmount: number;
  insAdvancedDays: number;
  insAdvancedAmount: number;
  insUbdDays: number;
  insUbdAmount: number;

  totalAdditionalDays: number;
  absenceDays: number;
  additionalDaysExceed: boolean;

  tilovaNadavkaDays: number;
  tilovaNadavkaAmount: number;

  stormRestoreDays: number;
  stormRestoreAmount: number;
  stormCaptureDays: number;
  stormCaptureAmount: number;
  stormExceed: boolean;

  prisonerCount: number;
  prisonerParticipants: number;
  prisonerAmount: number;
  prisonerRewardShare: number;

  destroyedCount: number;
  destroyedParticipants: number;
  destroyedAmount: number;
  destroyedRewardShare: number;

  limitAmount: number;
  limitCap: number;
  limitCapped: number;
  limitApplied: boolean;

  additionalRewardsTotal: number;
  hasCombatRewards: boolean;

  grossTotal: number;
  militaryTaxFull: number;
  militaryTaxExemption: number;
  militaryTaxActual: number;
  netPay: number;

  disciplineViolation: boolean;
}

export interface ResultRowItem {
  name: string;
  value?: number | null;
  valueFormatted?: string;
  abbr?: string;
  calc?: string;
  error?: string;
  errorTooltip?: string;
  nonBlocking?: boolean;
  limitItem?: boolean;
  negative?: boolean;
  rowType?: "normal" | "separator" | "divider" | "subtotal" | "final";
}

export const round2 = (val: number): number => Math.round(val * 100) / 100;

export function formatMoney(val: number | null | undefined): string {
  if (val == null || Number.isNaN(val)) return "0,00 ₴";
  const [intPart = "0", decPart = "00"] = Math.abs(val).toFixed(2).split(".");
  const spacedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const sign = val < 0 ? "−" : "";
  return `${sign}${spacedInt},${decPart} ₴`;
}

export function formatMoneyNumberOnly(val: number | null | undefined): string {
  if (val == null || Number.isNaN(val)) return "0,00";
  const [intPart = "0", decPart = "00"] = Math.abs(val).toFixed(2).split(".");
  const spacedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  const sign = val < 0 ? "−" : "";
  return `${sign}${spacedInt},${decPart}`;
}

export function calculateSalary(data: SalaryFormData): SalaryCalculationResult {
  const rank = SALARY_RANKS[data.rankIndex] ?? SALARY_RANKS[1];
  const ovz = rank.ovz;

  const tariff = TARIFF_GRADES[data.tariffIndex] ?? TARIFF_GRADES[0];
  const baseSalary = tariff.baseSalary;

  const seniority = SENIORITY_ALLOWANCES[data.seniorityIndex] ?? SENIORITY_ALLOWANCES[0];
  const seniorityPercent = seniority.percent;
  const seniorityBonus = round2(((baseSalary + ovz) * seniorityPercent) / 100);

  // Секретність
  let secrecyPercent = 0;
  if (data.hasSecrecy && data.secrecyIndex > 0) {
    const raw = SECRECY_OPTIONS[data.secrecyIndex]?.raw || "0";
    const parts = raw.split(";");
    secrecyPercent = data.secrecyDirectWork ? Number(parts[1] || 0) : Number(parts[0] || 0);
  }
  const secrecyBonus = round2((baseSalary * secrecyPercent) / 100);

  // Особливості проходження служби (НОПС)
  let nopsPercent = 65;
  let dutyCustomParts: string[] = [];
  if (data.dutyMode === "custom") {
    const raw = DUTY_CONDITIONS[data.dutyConditionIndex]?.raw || "65";
    dutyCustomParts = raw.split(";");
    nopsPercent = Number(dutyCustomParts[0] || 65);
  }
  const nopsBonus = round2(((baseSalary + ovz + seniorityBonus) * nopsPercent) / 100);

  // Щомісячна премія
  let premiumPercent = 0;
  if (dutyCustomParts[1]) {
    premiumPercent = Number(dutyCustomParts[1]);
  } else {
    // Місце проходження служби
    const branchVal = BRANCH_OPTIONS[data.branchIndex]?.value ?? 3;
    const isSpecial7 = branchVal === 7;
    const mult = isSpecial7 ? 1.7 : 1;
    let colIdx = isSpecial7 ? 2 : branchVal;
    if (seniorityPercent > 0 && colIdx === 3 && tariff.premiumA0952) {
      colIdx = 4;
    }
    const rawPremium =
      colIdx === 1
        ? tariff.premiumOfficer
        : colIdx === 2
        ? tariff.premiumSSO
        : colIdx === 4
        ? tariff.premiumA0952
        : tariff.premiumDSHV;
    premiumPercent = rawPremium * mult;
  }
  if (data.branchIndex === 1 && dutyCustomParts[2]) {
    premiumPercent = Number(dutyCustomParts[2]);
  }
  if (data.branchIndex === 2 && dutyCustomParts[3]) {
    premiumPercent = Number(dutyCustomParts[3]);
  }
  const premiumAmount = round2((baseSalary * premiumPercent) / 100);

  // ССО
  const ssoPosition = SSO_POSITIONS[data.ssoPositionIndex] ?? SSO_POSITIONS[0];
  const ssoPercent = ssoPosition.percent;
  const subsistence = data.subsistenceMinimum || DEFAULT_SUBSISTENCE_MINIMUM;
  const ssoBonus = round2(((subsistence * 5) * ssoPercent) / 100);

  // Класна кваліфікація
  let qualificationPercent = 0;
  if (data.hasQualification) {
    if (data.qualificationIndex === 5) {
      // Медичний та фармацевтичний склад
      const raw = MED_CATEGORY_OPTIONS[data.medCategoryIndex]?.raw || "0";
      if (raw !== "0") {
        const parts = raw.split(";");
        const posIdx = Math.max(1, Math.min(3, data.medPositionIndex));
        qualificationPercent = Number(parts[posIdx - 1] || 0);
      }
    } else if (data.qualificationIndex > 0) {
      const raw = QUALIFICATION_OPTIONS[data.qualificationIndex]?.raw || "0";
      if (raw !== "0") {
        const parts = raw.split(";");
        const isPilot = dutyCustomParts[4] === "pilot";
        qualificationPercent = isPilot ? Number(parts[1] || 0) : Number(parts[0] || 0);
      }
    }
  }
  const qualificationBonus = round2((baseSalary * qualificationPercent) / 100);

  // Шифрувальна служба
  const cryptoPercent =
    data.hasCrypto && data.cryptoIndex > 0
      ? CRYPTO_OPTIONS[data.cryptoIndex]?.percent || 0
      : 0;
  const cryptoBonus = round2((baseSalary * cryptoPercent) / 100);

  // Почесні звання
  const honoraryPercent =
    data.hasHonoraryTitle && data.honoraryTitleIndex > 0
      ? HONORARY_OPTIONS[data.honoraryTitleIndex]?.percent || 0
      : 0;
  const honoraryBonus = round2((baseSalary * honoraryPercent) / 100);

  // Спортивні звання
  const sportsPercent =
    data.hasSportsTitle && data.sportsTitleIndex > 0
      ? SPORTS_OPTIONS[data.sportsTitleIndex]?.percent || 0
      : 0;
  const sportsBonus = round2((baseSalary * sportsPercent) / 100);

  // Науковий ступінь
  const scienceDegreePercent =
    data.hasScienceDegree && data.scienceDegreeIndex > 0
      ? SCIENCE_DEGREE_OPTIONS[data.scienceDegreeIndex]?.percent || 0
      : 0;
  const scienceDegreeBonus = round2((baseSalary * scienceDegreePercent) / 100);

  // Вчене звання
  const academicRankPercent =
    data.hasAcademicRank && data.academicRankIndex > 0
      ? ACADEMIC_RANK_OPTIONS[data.academicRankIndex]?.percent || 0
      : 0;
  const academicRankBonus = round2((baseSalary * academicRankPercent) / 100);

  // Загальне щомісячне ГЗ
  const monthlySalaryTotal = round2(
    baseSalary +
      ovz +
      seniorityBonus +
      nopsBonus +
      secrecyBonus +
      premiumAmount +
      ssoBonus +
      qualificationBonus +
      cryptoBonus +
      honoraryBonus +
      sportsBonus +
      scienceDegreeBonus +
      academicRankBonus
  );

  // --- Бойові та додаткові винагороди ---
  const daysInMonth = new Date(data.year, data.month, 0).getDate();

  const P = data.cat170Enabled ? data.cat170Days : 0;
  const ye = data.cat70Enabled ? data.cat70Days : 0;
  const be = data.cat50Enabled ? data.cat50Days : 0;

  const isIns = data.instructorEnabled;
  const xe = isIns && data.insCommanderEnabled ? data.insCommanderDays : 0;
  const Se = isIns && data.insBasicEnabled ? data.insBasicDays : 0;
  const Ce = isIns && data.insMediumEnabled ? data.insMediumDays : 0;
  const we = isIns && data.insAdvancedEnabled ? data.insAdvancedDays : 0;
  const Te = isIns && data.insUbdEnabled ? data.insUbdDays : 0;

  const Ee = data.dv100combatEnabled ? data.dv100combatDays : 0;
  const De = data.dv30unitEnabled ? data.dv30unitDays : 0;
  const Oe = data.absenceEnabled ? data.absenceDays : 0;

  const ke = be + Ee + De + xe + Se + Ce + we + Te;
  const additionalDaysExceed = ke + Oe > daysInMonth;

  const cat170Amount = round2((170000 / daysInMonth) * P);
  const cat70Amount = round2((70000 / daysInMonth) * ye);
  const cat50Amount = additionalDaysExceed ? 0 : round2((50000 / daysInMonth) * be);

  const insCommanderAmount =
    !additionalDaysExceed && isIns && data.insCommanderEnabled
      ? round2((25000 / daysInMonth) * xe)
      : 0;
  const insBasicAmount =
    !additionalDaysExceed && isIns && data.insBasicEnabled
      ? round2((15000 / daysInMonth) * Se)
      : 0;
  const insMediumAmount =
    !additionalDaysExceed && isIns && data.insMediumEnabled
      ? round2((25000 / daysInMonth) * Ce)
      : 0;
  const insAdvancedAmount =
    !additionalDaysExceed && isIns && data.insAdvancedEnabled
      ? round2((30000 / daysInMonth) * we)
      : 0;
  const insUbdAmount =
    !additionalDaysExceed && isIns && data.insUbdEnabled
      ? round2((30000 / daysInMonth) * Te)
      : 0;

  let dv100combatAmount = 0;
  let dv30unitAmount = 0;
  if (!additionalDaysExceed) {
    if (Ee > 0) dv100combatAmount = round2((100000 / daysInMonth) * Ee);
    if (De > 0) dv30unitAmount = round2((30000 / daysInMonth) * De);
  }

  const stormRestoreDays = data.stormRestoreEnabled ? data.stormRestoreDays : 0;
  const stormCaptureDays = data.stormCaptureEnabled ? data.stormCaptureDays : 0;
  const stormExceed = stormRestoreDays + stormCaptureDays > daysInMonth;

  const tilovaNadavkaDays = additionalDaysExceed
    ? 0
    : Math.max(0, daysInMonth - ke - Oe - stormRestoreDays - stormCaptureDays);
  const tilovaNadavkaAmount = additionalDaysExceed
    ? 0
    : round2((10000 / daysInMonth) * tilovaNadavkaDays);

  const stormRestoreAmount = round2(20000 * stormRestoreDays);
  const stormCaptureAmount = round2(40000 * stormCaptureDays);

  const prisonerCount = data.prisonerCount || 0;
  const prisonerParticipants = Math.max(1, data.prisonerParticipants || 1);
  const prisonerAmount = round2((100000 * prisonerCount) / prisonerParticipants);
  const prisonerRewardShare = prisonerCount > 0 ? round2(100 / prisonerParticipants) : 0;

  const destroyedCount = data.destroyedCount || 0;
  const destroyedParticipants = Math.max(1, data.destroyedParticipants || 1);
  const destroyedAmount = round2((15000 * destroyedCount) / destroyedParticipants);
  const destroyedRewardShare = destroyedCount > 0 ? round2(100 / destroyedParticipants) : 0;

  // Винагороди, що підпадають під ліміт 460 000 грн (100к + 170к + 70к + штурмові)
  const stormTotalForLimit = !stormExceed ? stormCaptureAmount + stormRestoreAmount : 0;
  const limitAmount = round2(dv100combatAmount + cat170Amount + cat70Amount + stormTotalForLimit);
  const limitCapped = Math.min(limitAmount, MAX_REWARD_LIMIT_CAP);
  const limitApplied = limitAmount > MAX_REWARD_LIMIT_CAP;

  // Винагороди без ліміту (50к, 30к, тилова, інструкторські, полонені, знищені)
  const unlimitedRewards = round2(
    cat50Amount +
      dv30unitAmount +
      tilovaNadavkaAmount +
      insCommanderAmount +
      insBasicAmount +
      insMediumAmount +
      insAdvancedAmount +
      insUbdAmount +
      prisonerAmount +
      destroyedAmount
  );

  const additionalRewardsTotal = round2(limitCapped + unlimitedRewards);

  const hasCombatRewards =
    cat170Amount > 0 ||
    cat70Amount > 0 ||
    cat50Amount > 0 ||
    insAdvancedAmount > 0 ||
    insUbdAmount > 0 ||
    dv100combatAmount > 0 ||
    dv30unitAmount > 0 ||
    stormRestoreAmount > 0 ||
    stormCaptureAmount > 0 ||
    prisonerAmount > 0 ||
    destroyedAmount > 0;

  const grossTotal = round2(monthlySalaryTotal + additionalRewardsTotal);
  const militaryTaxFull = round2((grossTotal * 1.5) / 100);

  // Пільга з військового збору для учасників бойових дій (100к)
  const militaryTaxExemption =
    !additionalDaysExceed && Ee > 0
      ? round2(((monthlySalaryTotal + 100000) * 0.015 * Ee) / daysInMonth)
      : 0;

  const militaryTaxActual = round2(Math.max(0, militaryTaxFull - militaryTaxExemption));
  const netPay = round2(grossTotal - militaryTaxActual);

  return {
    ovz,
    baseSalary,
    seniorityPercent,
    seniorityBonus,
    nopsPercent,
    nopsBonus,
    premiumPercent,
    premiumAmount,
    ssoBonus,
    secrecyPercent,
    secrecyBonus,
    qualificationPercent,
    qualificationBonus,
    cryptoPercent,
    cryptoBonus,
    honoraryPercent,
    honoraryBonus,
    sportsPercent,
    sportsBonus,
    scienceDegreePercent,
    scienceDegreeBonus,
    academicRankPercent,
    academicRankBonus,
    monthlySalaryTotal,
    daysInMonth,
    calcMonth: data.month,
    calcYear: data.year,
    dv100combatDays: Ee,
    dv100combatAmount,
    dv30unitDays: De,
    dv30unitAmount,
    cat50Days: be,
    cat50Amount,
    cat170Days: P,
    cat170Amount,
    cat70Days: ye,
    cat70Amount,
    insCommanderDays: xe,
    insCommanderAmount,
    insBasicDays: Se,
    insBasicAmount,
    insMediumDays: Ce,
    insMediumAmount,
    insAdvancedDays: we,
    insAdvancedAmount,
    insUbdDays: Te,
    insUbdAmount,
    totalAdditionalDays: ke,
    absenceDays: Oe,
    additionalDaysExceed,
    tilovaNadavkaDays,
    tilovaNadavkaAmount,
    stormRestoreDays,
    stormRestoreAmount,
    stormCaptureDays,
    stormCaptureAmount,
    stormExceed,
    prisonerCount,
    prisonerParticipants,
    prisonerAmount,
    prisonerRewardShare,
    destroyedCount,
    destroyedParticipants,
    destroyedAmount,
    destroyedRewardShare,
    limitAmount,
    limitCap: MAX_REWARD_LIMIT_CAP,
    limitCapped,
    limitApplied,
    additionalRewardsTotal,
    hasCombatRewards,
    grossTotal,
    militaryTaxFull,
    militaryTaxExemption,
    militaryTaxActual,
    netPay,
    disciplineViolation: data.disciplineViolation,
  };
}

export function buildSalaryResultRows(res: SalaryCalculationResult): ResultRowItem[] {
  const rows: ResultRowItem[] = [];
  const R = formatMoneyNumberOnly;

  // 1. Оклад за званням
  rows.push({
    name: "Оклад за військовим званням",
    value: res.ovz,
    abbr: "ОВЗ",
  });

  // 2. Посадовий оклад
  rows.push({
    name: "Посадовий оклад",
    value: res.baseSalary,
    abbr: "ПО",
  });

  // 3. Надбавка за вислугу
  if (res.seniorityBonus > 0) {
    rows.push({
      name: "Надбавка за вислугу років",
      value: res.seniorityBonus,
      abbr: "НВР",
      calc: `(${R(res.baseSalary)} ПО + ${R(res.ovz)} ОВЗ) × ${res.seniorityPercent}%`,
    });
  }

  // 4. Секретність
  if (res.secrecyBonus > 0) {
    rows.push({
      name: "Надбавка за таємність",
      value: res.secrecyBonus,
      abbr: "НзТ",
      calc: `${R(res.baseSalary)} ПО × ${res.secrecyPercent}%`,
    });
  }

  // 5. НОПС
  if (res.nopsBonus > 0) {
    rows.push({
      name: "Надбавка за особливості проходження служби",
      value: res.nopsBonus,
      abbr: "НОПС",
      calc: `(${R(res.baseSalary)} ПО + ${R(res.ovz)} ОВЗ + ${R(res.seniorityBonus)} НВР) × ${res.nopsPercent}%`,
    });
  }

  // 6. Премія
  if (res.premiumAmount > 0) {
    rows.push({
      name: "Щомісячна премія",
      value: res.premiumAmount,
      abbr: "ЩП",
      calc: `${R(res.baseSalary)} ПО × ${res.premiumPercent}%`,
    });
  }

  // 7. ССО
  if (res.ssoBonus > 0) {
    rows.push({
      name: "Надбавка за службу в ССО",
      value: res.ssoBonus,
      abbr: "ССО",
      calc: `3 328 прожитковий мінімум × 5 × ${(res.ssoBonus / (3328 * 5)) * 100}%`,
    });
  }

  // 8. Кваліфікація
  if (res.qualificationBonus > 0) {
    rows.push({
      name: "Надбавка за кваліфікацію",
      value: res.qualificationBonus,
      abbr: "НзК",
      calc: `${R(res.baseSalary)} ПО × ${res.qualificationPercent}%`,
    });
  }

  // 9. Почесні звання
  if (res.honoraryBonus > 0) {
    rows.push({
      name: "Надбавка за почесні звання",
      value: res.honoraryBonus,
      abbr: "НзПЗ",
      calc: `${R(res.baseSalary)} ПО × ${res.honoraryPercent}%`,
    });
  }

  // 10. Шифрувальна робота
  if (res.cryptoBonus > 0) {
    rows.push({
      name: "Надбавка за стаж на шифрувальній роботі",
      value: res.cryptoBonus,
      abbr: "НзШР",
      calc: `${R(res.baseSalary)} ПО × ${res.cryptoPercent}%`,
    });
  }

  // 11. Спортивні звання
  if (res.sportsBonus > 0) {
    rows.push({
      name: "Надбавка за спортивні звання",
      value: res.sportsBonus,
      abbr: "НзСЗ",
      calc: `${R(res.baseSalary)} ПО × ${res.sportsPercent}%`,
    });
  }

  // 12. Науковий ступінь
  if (res.scienceDegreeBonus > 0) {
    rows.push({
      name: "Надбавка за науковий ступінь",
      value: res.scienceDegreeBonus,
      abbr: "НзНС",
      calc: `${R(res.baseSalary)} ПО × ${res.scienceDegreePercent}%`,
    });
  }

  // 13. Вчене звання
  if (res.academicRankBonus > 0) {
    rows.push({
      name: "Надбавка за вчене звання",
      value: res.academicRankBonus,
      abbr: "НзВЗ",
      calc: `${R(res.baseSalary)} ПО × ${res.academicRankPercent}%`,
    });
  }

  // Підсумок основного ГЗ
  rows.push({
    name: "Разом місячне грошове забезпечення",
    value: res.monthlySalaryTotal,
    abbr: "ГЗ",
    rowType: "separator",
  });

  // --- Бойові та додаткові виплати ---
  const totalDays = res.totalAdditionalDays + (res.absenceDays || 0);
  const monthNames = [
    "", "січні", "лютому", "березні", "квітні", "травні", "червні",
    "липні", "серпні", "вересні", "жовтні", "листопаді", "грудні"
  ];
  const mName = monthNames[res.calcMonth] || "";

  if (totalDays > res.daysInMonth) {
    rows.push({
      name: "Додаткові винагороди",
      value: null,
      error: "Кількість днів перевищує можливий ліміт",
      errorTooltip: `Загальна кількість зазначених днів (${totalDays}) не може перевищувати кількість календарних днів у вибраному місяці (${mName}: ${res.daysInMonth} дн.). Перевірте кількість днів отримання додаткових винагород та тривалість навчання або відпустки.`,
    });
  }

  if (res.cat170Days + res.cat70Days > res.daysInMonth) {
    rows.push({
      name: "Одноразові винагороди",
      value: null,
      error: "Кількість днів перевищує можливий ліміт",
      errorTooltip: `Загальна кількість зазначених днів (${res.cat170Days + res.cat70Days}) не може перевищувати кількість календарних днів у вибраному місяці (${mName}: ${res.daysInMonth} дн.).`,
    });
  }

  if (res.stormExceed) {
    rows.push({
      name: "Штурмові дії",
      value: null,
      error: "Кількість днів перевищує можливий ліміт",
      errorTooltip: `Загальна кількість діб (${res.stormRestoreDays + res.stormCaptureDays}) не може перевищувати кількість календарних днів у вибраному місяці (${mName}: ${res.daysInMonth} дн.). Якщо за одну добу ви мали право на обидві винагороди, врахуйте її лише для винагороди 40 000 грн.`,
    });
  }

  if (res.additionalRewardsTotal > 0 || res.cat170Amount > 0 || res.dv100combatAmount > 0) {
    rows.push({
      name: "Додаткові та бойові винагороди",
      rowType: "divider",
    });

    if (res.dv100combatAmount > 0) {
      rows.push({
        name: "Дод. винагорода 100 тис. (бойові дії)",
        value: res.dv100combatAmount,
        abbr: "ДВ100",
        calc: `100 000 / ${res.daysInMonth} × ${res.dv100combatDays} днів`,
        limitItem: res.limitApplied,
      });
    }

    if (res.dv30unitAmount > 0) {
      rows.push({
        name: "Дод. винагорода 30 тис. (бойові завдання)",
        value: res.dv30unitAmount,
        abbr: "ДВ30",
        calc: `30 000 / ${res.daysInMonth} × ${res.dv30unitDays} днів`,
      });
    }

    if (res.cat170Amount > 0) {
      rows.push({
        name: "Бойові завдання 170 тис. (до взводу)",
        value: res.cat170Amount,
        abbr: "ДВ170",
        calc: `170 000 / ${res.daysInMonth} × ${res.cat170Days} днів`,
        limitItem: res.limitApplied,
      });
    }

    if (res.cat70Amount > 0) {
      rows.push({
        name: "Бойові завдання 70 тис. (до роти)",
        value: res.cat70Amount,
        abbr: "ДВ70",
        calc: `70 000 / ${res.daysInMonth} × ${res.cat70Days} днів`,
        limitItem: res.limitApplied,
      });
    }

    if (res.cat50Amount > 0) {
      rows.push({
        name: "Дод. винагорода 50 тис. (пункт управління)",
        value: res.cat50Amount,
        abbr: "ДВ50",
        calc: `50 000 / ${res.daysInMonth} × ${res.cat50Days} днів`,
      });
    }

    if (res.insCommanderAmount > 0) {
      rows.push({
        name: "Інструктор (командир підрозділу)",
        value: res.insCommanderAmount,
        calc: `25 000 / ${res.daysInMonth} × ${res.insCommanderDays} днів`,
      });
    }

    if (res.insBasicAmount > 0) {
      rows.push({
        name: "Інструктор (базовий рівень)",
        value: res.insBasicAmount,
        calc: `15 000 / ${res.daysInMonth} × ${res.insBasicDays} днів`,
      });
    }

    if (res.insMediumAmount > 0) {
      rows.push({
        name: "Інструктор (середній рівень)",
        value: res.insMediumAmount,
        calc: `25 000 / ${res.daysInMonth} × ${res.insMediumDays} днів`,
      });
    }

    if (res.insAdvancedAmount > 0) {
      rows.push({
        name: "Інструктор (підвищений рівень)",
        value: res.insAdvancedAmount,
        calc: `30 000 / ${res.daysInMonth} × ${res.insAdvancedDays} днів`,
      });
    }

    if (res.insUbdAmount > 0) {
      rows.push({
        name: "Інструктор (зі статусом УБД)",
        value: res.insUbdAmount,
        calc: `30 000 / ${res.daysInMonth} × ${res.insUbdDays} днів`,
      });
    }

    if (res.tilovaNadavkaAmount > 0) {
      rows.push({
        name: "Тилова надбавка",
        value: res.tilovaNadavkaAmount,
        abbr: "ТН",
        calc: `10 000 / ${res.daysInMonth} × ${res.tilovaNadavkaDays} днів`,
      });
    }

    if (!res.stormExceed) {
      if (res.stormRestoreAmount > 0) {
        rows.push({
          name: "Штурмові дії (відновлення)",
          value: res.stormRestoreAmount,
          abbr: "ШД20",
          calc: `20 000 × ${res.stormRestoreDays} діб`,
          limitItem: res.limitApplied,
        });
      }
      if (res.stormCaptureAmount > 0) {
        rows.push({
          name: "Штурмові дії (захоплення)",
          value: res.stormCaptureAmount,
          abbr: "ШД40",
          calc: `40 000 × ${res.stormCaptureDays} діб`,
          limitItem: res.limitApplied,
        });
      }
    }

    if (res.prisonerAmount > 0) {
      rows.push({
        name: "Частка винагороди за взяття в полон",
        valueFormatted: `${res.prisonerRewardShare}%`,
        calc: `1 ÷ ${res.prisonerParticipants} осіб × 100%`,
      });
      rows.push({
        name: "Винагорода за взяття в полон",
        value: res.prisonerAmount,
        abbr: "ПОЛ",
        calc: `100 000 × ${res.prisonerCount} осіб ÷ ${res.prisonerParticipants} осіб`,
      });
    }

    if (res.destroyedAmount > 0) {
      rows.push({
        name: "Частка винагороди за знищення",
        valueFormatted: `${res.destroyedRewardShare}%`,
        calc: `1 ÷ ${res.destroyedParticipants} осіб × 100%`,
      });
      rows.push({
        name: "Винагорода за знищення",
        value: res.destroyedAmount,
        abbr: "ЗН",
        calc: `15 000 × ${res.destroyedCount} осіб ÷ ${res.destroyedParticipants} осіб`,
      });
    }

    if (res.limitApplied) {
      const diff = round2(res.limitAmount - MAX_REWARD_LIMIT_CAP);
      rows.push({
        name: `Перевищено ліміт ${formatMoney(MAX_REWARD_LIMIT_CAP)}`,
        value: diff,
        error: `Перевищено на ${formatMoney(diff)}`,
        calc: `Розрахована сума (${formatMoney(res.limitAmount)}) обмежена граничним лімітом 460 000 грн.`,
        errorTooltip:
          "До ліміту 460 000 грн включаються: 100 000 грн (бойові дії), 170 000 грн (до взводу), 70 000 грн (до роти) та штурмові дії (20 000 / 40 000 грн).",
        limitItem: true,
      });
    }

    rows.push({
      name: "Разом додаткові винагороди",
      value: res.additionalRewardsTotal,
      abbr: "ДВ",
      rowType: "subtotal",
      limitItem: res.limitApplied,
    });
  }

  // Разом нараховано
  rows.push({
    name: "Разом нараховано",
    value: res.grossTotal,
    abbr: "РН",
    calc:
      res.additionalRewardsTotal > 0
        ? `${R(res.monthlySalaryTotal)} ГЗ + ${R(res.additionalRewardsTotal)} ДВ`
        : "",
    rowType: "subtotal",
  });

  // Попередження про дисципліну
  if (res.disciplineViolation) {
    rows.push({
      name: "Порушення військової дисципліни",
      error: "У разі наявності дисциплінарних стягнень фактична сума премії може бути значно зменшена.",
      calc: "У разі наявності стягнень розмір премії визначається рішенням командира.",
      nonBlocking: true,
    });
  }

  // Військовий збір
  if (res.militaryTaxActual > 0 || res.militaryTaxExemption > 0) {
    rows.push({
      name: "Військовий збір (1.5%)",
      value: -res.militaryTaxActual,
      abbr: "ВЗ",
      calc:
        res.militaryTaxExemption > 0
          ? `${R(res.militaryTaxFull)} повний ВЗ − ${R(res.militaryTaxExemption)} пільга`
          : `${R(res.grossTotal)} × 1.5%`,
      negative: true,
    });
  }

  if (res.hasCombatRewards && res.militaryTaxExemption > 0) {
    rows.push({
      name: "Безпосередня участь у бойових діях",
      error:
        "Виплати за дні участі у бойових діях звільняються від утримання військового збору згідно з ПКУ.",
      calc: "Звільнення від військового збору на період воєнного стану.",
      nonBlocking: true,
    });
  }

  // Підсумок до виплати
  rows.push({
    name: "До видачі на руки",
    value: res.netPay,
    rowType: "final",
  });

  return rows;
}
