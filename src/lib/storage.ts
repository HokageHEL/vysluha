import { ServiceExtractPerson } from "./exportServiceRecord";
import { ServiceExtraPeriod, ServiceRecord } from "./types";

export interface AppState {
  person: ServiceExtractPerson;
  records: ServiceRecord[];
  extras: ServiceExtraPeriod[];
}

export const EMPTY_STATE: AppState = {
  person: { fullName: "", militaryRank: "", position: "", unit: "" },
  records: [],
  extras: [],
};

const STORAGE_KEY = "vysluha:state:v1";

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

// Мінімальна валідація імпортованого файлу: беремо лише знайомі поля
function normalize(data: unknown): AppState {
  const obj = (data ?? {}) as Partial<AppState>;
  const person = (obj.person ?? {}) as Partial<ServiceExtractPerson>;
  return {
    person: {
      fullName: String(person.fullName ?? ""),
      militaryRank: String(person.militaryRank ?? ""),
      position: String(person.position ?? ""),
      unit: String(person.unit ?? ""),
    },
    records: Array.isArray(obj.records) ? (obj.records as ServiceRecord[]) : [],
    extras: Array.isArray(obj.extras)
      ? (obj.extras as ServiceExtraPeriod[])
      : [],
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
  link.download = `${state.person.fullName || "вислуга"}.json`;
  link.click();
  URL.revokeObjectURL(url);
}
