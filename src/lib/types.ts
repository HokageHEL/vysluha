// Дані військовослужбовця для шапки витягу
export interface ServiceExtractPerson {
  lastName: string;
  firstName: string;
  middleName: string;
  militaryRank: string;
  birthYear: string; // «1985»
  taxId: string; // РНОКПП
  serviceStartDate: string; // YYYY-MM-DD, «у Збройних Силах України – з …»
  serviceEndDate: string; // YYYY-MM-DD, "" = по т.ч.
  contractNote: string; // статус контракту, може бути в кілька рядків
  headerOverride: string; // ручна правка рядка «звання + ПІБ у родовому відмінку»
}

// Запис послужного списку. Календарна вислуга формується з цих періодів.
export interface ServiceRecord {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD, "" = по теперішній час
  position: string; // займана посада
  place: string; // місце проходження служби
}

// Подія служби — рядок на всю ширину таблиці між періодами:
// призов по мобілізації, укладення чи продовження контракту.
export interface ServiceEvent {
  date: string; // YYYY-MM-DD, визначає місце події серед періодів
  text: string;
}

// Підвал витягу: хто підписує і хто виконавець
export interface SignatureBlock {
  positionLines: string; // посада підписанта, може бути в кілька рядків
  rank: string;
  name: string; // «Іван КОВАЛЕНКО» — ім'я і прізвище великими
  executor: string;
  executorPhone: string;
}

// Додаткові види вислуги з іншими коефіцієнтами (вкладка «Вислуга»)
export interface ServiceExtraPeriod {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD, "" = по теперішній час
  coefficient: "calendar" | "preferential" | "double" | "oneHalf" | "fortyDays" | "study" | "none";
  studyEligible?: boolean; // підтверджені умови п. 2; старі записи потребують перевірки
  note?: string;
}

// Скорочений запис для звичайного режиму: лише строк служби та коефіцієнт.
export interface SimpleServicePeriod {
  startDate: string;
  endDate: string;
  coefficient: "calendar" | "preferential" | "double" | "oneHalf" | "fortyDays";
}
