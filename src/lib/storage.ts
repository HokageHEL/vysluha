import { serviceRule } from "./service-rules";
import {
  ServiceEvent,
  ServiceExtraPeriod,
  ServiceExtractPerson,
  ServiceRecord,
  SimpleServicePeriod,
  SignatureBlock,
} from "./types";

export interface AppState {
  mode: "standard" | "pro";
  person: ServiceExtractPerson;
  records: ServiceRecord[];
  events: ServiceEvent[];
  signature: SignatureBlock;
  extras: ServiceExtraPeriod[];
  calculationDate: string;
  simplePeriods: SimpleServicePeriod[];
}

const EMPTY_PERSON: ServiceExtractPerson = {
  lastName: "",
  firstName: "",
  middleName: "",
  militaryRank: "",
  birthYear: "",
  taxId: "",
  serviceStartDate: "",
  serviceEndDate: "",
  contractNote: "",
  headerOverride: "",
};

const EMPTY_SIGNATURE: SignatureBlock = {
  positionLines: "",
  rank: "",
  name: "",
  executor: "",
  executorPhone: "",
};

export const EMPTY_STATE: AppState = {
  mode: "standard",
  person: EMPTY_PERSON,
  records: [],
  events: [],
  signature: EMPTY_SIGNATURE,
  extras: [],
  calculationDate: "",
  simplePeriods: [],
};

const STORAGE_KEY = "vysluha:state:v1";
const HOWTO_SEEN_KEY = "vysluha:howto-seen";
const PRIVACY_NOTICE_DISMISSED_KEY = "vysluha:privacy-notice-dismissed";

// Інструкція показується автоматично лише при першому відкритті.
export function isHowToSeen(): boolean {
  try {
    return localStorage.getItem(HOWTO_SEEN_KEY) === "1";
  } catch {
    // сховище недоступне — не нагадуємо щоразу, є кнопка в шапці
    return true;
  }
}

export function markHowToSeen(): void {
  try {
    localStorage.setItem(HOWTO_SEEN_KEY, "1");
  } catch {
    // ignore
  }
}

export function isPrivacyNoticeDismissed(): boolean {
  try {
    return localStorage.getItem(PRIVACY_NOTICE_DISMISSED_KEY) === "1";
  } catch {
    return false;
  }
}

export function dismissPrivacyNotice(): void {
  try {
    localStorage.setItem(PRIVACY_NOTICE_DISMISSED_KEY, "1");
  } catch {
    // ignore
  }
}

// Дані живуть лише в браузері користувача — сервера й бази тут немає.
export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalize(JSON.parse(raw)) : EMPTY_STATE;
  } catch {
    return EMPTY_STATE;
  }
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // приватний режим / переповнене сховище — просто працюємо без збереження
  }
}

export function clearState(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

const str = (value: unknown): string =>
  typeof value === "string" ? value : "";

// Стан, збережений до переходу на формат зі зразка, мав одне поле ПІБ
function normalizePerson(data: unknown): ServiceExtractPerson {
  const raw = (data ?? {}) as Record<string, unknown>;
  const [lastName = "", firstName = "", middleName = ""] = str(raw.fullName)
    .trim()
    .split(/\s+/);
  return {
    lastName: str(raw.lastName) || lastName,
    firstName: str(raw.firstName) || firstName,
    middleName: str(raw.middleName) || middleName,
    militaryRank: str(raw.militaryRank),
    birthYear: str(raw.birthYear),
    taxId: str(raw.taxId),
    serviceStartDate: str(raw.serviceStartDate),
    serviceEndDate: str(raw.serviceEndDate),
    contractNote: str(raw.contractNote),
    headerOverride: str(raw.headerOverride),
  };
}

function normalizeSignature(data: unknown): SignatureBlock {
  const raw = (data ?? {}) as Record<string, unknown>;
  return {
    positionLines: str(raw.positionLines),
    rank: str(raw.rank),
    name: str(raw.name),
    executor: str(raw.executor),
    executorPhone: str(raw.executorPhone),
  };
}

const list = <T,>(value: unknown, map: (raw: Record<string, unknown>) => T): T[] =>
  Array.isArray(value)
    ? value.map((item) => map((item ?? {}) as Record<string, unknown>))
    : [];

// Мінімальна валідація імпортованого файлу: беремо лише знайомі поля.
// Заразом відсіюються поля, які застосунок більше не використовує.
function normalizeCoefficient(value: unknown): ServiceExtraPeriod["coefficient"] {
  const rule = serviceRule(value);
  if (!rule) throw new Error("Невідомий коефіцієнт вислуги в збережених даних.");
  return rule.value;
}

function normalize(data: unknown): AppState {
  const obj = (data ?? {}) as Record<string, unknown>;
  return {
    mode: obj.mode === "pro" ? "pro" : "standard",
    person: normalizePerson(obj.person),
    calculationDate: str(obj.calculationDate),
    records: list<ServiceRecord>(obj.records, (raw) => ({
      startDate: str(raw.startDate),
      endDate: str(raw.endDate),
      position: str(raw.position),
      place: str(raw.place),
    })),
    events: list<ServiceEvent>(obj.events, (raw) => ({
      date: str(raw.date),
      text: str(raw.text),
    })),
    signature: normalizeSignature(obj.signature),
    extras: list<ServiceExtraPeriod>(obj.extras, (raw) => ({
      startDate: str(raw.startDate),
      endDate: str(raw.endDate),
      coefficient:
        normalizeCoefficient(raw.coefficient),
      note: str(raw.note),
      studyEligible: raw.studyEligible === true,
    })),
    simplePeriods: list<SimpleServicePeriod>(obj.simplePeriods, (raw) => {
      const coefficient = normalizeCoefficient(raw.coefficient);
      return {
        startDate: str(raw.startDate),
        endDate: str(raw.endDate),
        coefficient: coefficient === "study" || coefficient === "none" ? "calendar" : coefficient,
      };
    }),
  };
}

export function parseImported(text: string): AppState {
  return normalize(JSON.parse(text));
}

export function downloadState(state: AppState): void {
  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${state.person.lastName || "вислуга"}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
