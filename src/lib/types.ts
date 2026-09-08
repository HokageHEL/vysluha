// Запис послужного списку. Календарна вислуга формується з цих періодів.
export interface ServiceRecord {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD, "" = по теперішній час
  position?: string; // посада
  vos?: string; // ВОС
  place: string; // місце служби
  appointmentOrderNumber?: string; // наказ на призначення
  appointmentOrderDate?: string;
  enrollmentOrderNumber?: string; // наказ по стройовій про зарахування
  enrollmentOrderDate?: string;
  dismissalOrderNumber?: string; // наказ на виключення (по стройовій)
  dismissalOrderDate?: string;
}

// Додаткові види вислуги з іншими коефіцієнтами (вкладка «Вислуга»)
export interface ServiceExtraPeriod {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD, "" = по теперішній час
  coefficient: "preferential" | "study" | "none";
  note?: string;
}
