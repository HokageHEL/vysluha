import { useMemo, useState } from "react";
import {
  SalaryFormData,
  calculateSalary,
  buildSalaryResultRows,
  formatMoney,
  formatMoneyNumberOnly,
} from "@/lib/salary-calc";
import {
  ACADEMIC_RANK_OPTIONS,
  BRANCH_OPTIONS,
  CALC_MONTHS,
  CRYPTO_OPTIONS,
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
  matchRankToSalaryRankIndex,
  matchSeniorityYearsToIndex,
} from "@/lib/salary-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Award,
  Calculator,
  Calendar,
  ChevronDown,
  ChevronUp,
  Crosshair,
  ExternalLink,
  Flame,
  Info,
  RotateCcw,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

interface SalaryCalculatorTabProps {
  salary: SalaryFormData;
  onChangeSalary: (salary: SalaryFormData) => void;
  personRank?: string;
  calculatedSeniorityYears?: number;
}

export const SalaryCalculatorTab = ({
  salary,
  onChangeSalary,
  personRank,
  calculatedSeniorityYears,
}: SalaryCalculatorTabProps) => {
  const [activeSection, setActiveSection] = useState<"base" | "combat">("base");
  const [showAllowances, setShowAllowances] = useState(false);
  const [dutySearch, setDutySearch] = useState("");

  const update = (patch: Partial<SalaryFormData>) => {
    onChangeSalary({ ...salary, ...patch });
  };

  const resetToDefault = () => {
    if (!confirm("Скинути всі параметри калькулятора грошового забезпечення до початкових?")) return;
    onChangeSalary({
      ...salary,
      rankIndex: 1,
      tariffIndex: 0,
      seniorityIndex: 0,
      dutyMode: "default",
      dutyConditionIndex: 0,
      branchIndex: 0,
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
    });
  };

  // Розрахунок результатів
  const result = useMemo(() => calculateSalary(salary), [salary]);
  const rows = useMemo(() => buildSalaryResultRows(result), [result]);

  // Можливість швидкого заповнення з наявних даних
  const canSyncFromPerson = Boolean(
    personRank || (calculatedSeniorityYears !== undefined && calculatedSeniorityYears > 0)
  );

  const syncFromPerson = () => {
    const patch: Partial<SalaryFormData> = {};
    if (personRank) {
      patch.rankIndex = matchRankToSalaryRankIndex(personRank);
    }
    if (calculatedSeniorityYears !== undefined && calculatedSeniorityYears >= 0) {
      patch.seniorityIndex = matchSeniorityYearsToIndex(calculatedSeniorityYears);
    }
    update(patch);
  };

  // Фільтрація особливостей служби для пошуку
  const filteredDuties = useMemo(() => {
    if (!dutySearch.trim()) return DUTY_CONDITIONS;
    const q = dutySearch.toLowerCase();
    return DUTY_CONDITIONS.filter((d) => d.label.toLowerCase().includes(q));
  }, [dutySearch]);

  const daysInMonth = result.daysInMonth;

  return (
    <div className="space-y-4">
      {/* Шапка з посиланням на офіційне джерело та швидкою синхронізацією */}
      <div className="flex flex-col gap-2 rounded-lg border bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5 text-sm">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground">
                Калькулятор грошового забезпечення військовослужбовця ЗСУ
              </span>
              <a
                href="https://social.mil.gov.ua/groshove-zabezpechennya/rozrakhunok-hroshovoho-zabezpechennia-viiskovosluzhbovtsia-calculiator.html"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary underline underline-offset-2 hover:text-primary/80"
                title="Офіційний ресурс Міністерства оборони України"
              >
                social.mil.gov.ua
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              Постанова КМУ № 704, Наказ МОУ № 260 та актуальні бойові виплати
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canSyncFromPerson && (
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={syncFromPerson}
              title="Підтягнути звання та вислугу з вашого послужного списку"
            >
              <Sparkles className="mr-1 h-3.5 w-3.5 text-amber-500" />
              Взяти з картки
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground hover:text-foreground"
            onClick={resetToDefault}
            title="Скинути поля до початкового стану"
          >
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            Скинути
          </Button>
        </div>
      </div>

      {/* Основний двоколонковий контейнер */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* Ліва частина — форма вводу (7 з 12 колонок на десктопі) */}
        <div className="space-y-4 lg:col-span-7">
          {/* Перемикач розділів (Основне / Бойові) */}
          <div className="flex rounded-md bg-muted p-1 text-sm font-medium">
            <button
              type="button"
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-sm py-1.5 transition-colors ${
                activeSection === "base"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveSection("base")}
            >
              <Shield className="h-4 w-4 text-primary" />
              1. Основне грошове забезпечення
            </button>
            <button
              type="button"
              className={`flex flex-1 items-center justify-center gap-1.5 rounded-sm py-1.5 transition-colors ${
                activeSection === "combat"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setActiveSection("combat")}
            >
              <Flame className="h-4 w-4 text-orange-500" />
              2. Бойові та додаткові виплати
              {result.hasCombatRewards && (
                <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-orange-500" />
              )}
            </button>
          </div>

          {/* Розділ 1: Основне щомісячне грошове забезпечення */}
          {activeSection === "base" && (
            <Card>
              <CardHeader className="border-b bg-muted/20 px-4 py-3">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <Shield className="h-4 w-4 text-primary" />
                  Посада, звання та базові оклади
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4 text-sm">
                {/* Звання */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    Військове звання (оклад за званням)
                  </Label>
                  <Select
                    value={String(salary.rankIndex)}
                    onValueChange={(val) => update({ rankIndex: Number(val) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {SALARY_RANKS.map((r) => (
                        <SelectItem key={r.index} value={String(r.index)}>
                          <span className="flex items-center justify-between gap-4">
                            <span>{r.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {r.ovz} грн
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Тарифний розряд */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    Тарифний розряд посади (посадовий оклад)
                  </Label>
                  <Select
                    value={String(salary.tariffIndex)}
                    onValueChange={(val) => update({ tariffIndex: Number(val) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-64">
                      {TARIFF_GRADES.map((t) => (
                        <SelectItem key={t.index} value={String(t.index)}>
                          <span className="flex items-center justify-between gap-4">
                            <span>{t.label}</span>
                            <span className="text-xs font-mono text-muted-foreground">
                              {t.baseSalary} грн
                            </span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Вислуга років */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    Вислуга років (надбавка за вислугу)
                  </Label>
                  <Select
                    value={String(salary.seniorityIndex)}
                    onValueChange={(val) => update({ seniorityIndex: Number(val) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SENIORITY_ALLOWANCES.map((s) => (
                        <SelectItem key={s.index} value={String(s.index)}>
                          {s.label} ({s.percent}%)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Рід військ / місце проходження служби */}
                <div className="space-y-1.5">
                  <Label className="text-xs font-semibold text-foreground">
                    Місце проходження служби (базовий % премії)
                  </Label>
                  <Select
                    value={String(salary.branchIndex)}
                    onValueChange={(val) => update({ branchIndex: Number(val) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANCH_OPTIONS.map((b) => (
                        <SelectItem key={b.index} value={String(b.index)}>
                          {b.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Якщо ССО — посада в ССО */}
                {salary.branchIndex === 1 && (
                  <div className="rounded-md border border-primary/20 bg-primary/5 p-3 space-y-2">
                    <Label className="text-xs font-semibold text-primary">
                      Посада в Силах спеціальних операцій (надбавка до 5 прожиткових мінімумів)
                    </Label>
                    <Select
                      value={String(salary.ssoPositionIndex)}
                      onValueChange={(val) => update({ ssoPositionIndex: Number(val) })}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {SSO_POSITIONS.map((s) => (
                          <SelectItem key={s.index} value={String(s.index)}>
                            {s.label} {s.percent > 0 ? `(${s.percent}%)` : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Надбавка за особливості проходження служби (НОПС) */}
                <div className="space-y-2 rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-xs font-semibold text-foreground">
                        Особливості проходження служби (НОПС)
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Базовий розмір — 65% або підвищений для окремих категорій
                      </p>
                    </div>
                    <div className="inline-flex rounded-md bg-muted p-0.5 text-xs font-medium">
                      <button
                        type="button"
                        className={`rounded px-2.5 py-1 ${
                          salary.dutyMode === "default"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground"
                        }`}
                        onClick={() => update({ dutyMode: "default" })}
                      >
                        Базовий (65%)
                      </button>
                      <button
                        type="button"
                        className={`rounded px-2.5 py-1 ${
                          salary.dutyMode === "custom"
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground"
                        }`}
                        onClick={() => update({ dutyMode: "custom" })}
                      >
                        Підвищений
                      </button>
                    </div>
                  </div>

                  {salary.dutyMode === "custom" && (
                    <div className="space-y-2 pt-2">
                      <Input
                        placeholder="Пошук категорії (наприклад, снайпер, ДШВ, льотний, медик...)"
                        value={dutySearch}
                        onChange={(e) => setDutySearch(e.target.value)}
                        className="h-8 text-xs"
                      />
                      <Select
                        value={String(salary.dutyConditionIndex)}
                        onValueChange={(val) => update({ dutyConditionIndex: Number(val) })}
                      >
                        <SelectTrigger className="text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-72">
                          {filteredDuties.map((d) => (
                            <SelectItem key={d.index} value={String(d.index)} className="text-xs">
                              {d.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {/* Розгортання блоку: Кваліфікація та інші надбавки */}
                <div className="border-t pt-2">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between rounded-md p-1.5 text-xs font-semibold text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    onClick={() => setShowAllowances(!showAllowances)}
                  >
                    <span className="flex items-center gap-1.5">
                      <Award className="h-4 w-4 text-primary" />
                      Кваліфікація, таємність, звання та інші надбавки
                    </span>
                    {showAllowances ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  {showAllowances && (
                    <div className="mt-3 space-y-3 rounded-lg border bg-muted/10 p-3 text-xs">
                      {/* Секретність */}
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={salary.hasSecrecy}
                            onChange={(e) => update({ hasSecrecy: e.target.checked })}
                            className="rounded border-input text-primary"
                          />
                          <span className="font-medium">Доступ до державної таємниці</span>
                        </label>
                        {salary.hasSecrecy && (
                          <div className="ml-5 space-y-2 pt-1">
                            <Select
                              value={String(salary.secrecyIndex)}
                              onValueChange={(val) => update({ secrecyIndex: Number(val) })}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {SECRECY_OPTIONS.map((s) => (
                                  <SelectItem key={s.index} value={String(s.index)}>
                                    {s.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <label className="flex items-center gap-2 text-muted-foreground">
                              <input
                                type="checkbox"
                                checked={salary.secrecyDirectWork}
                                onChange={(e) => update({ secrecyDirectWork: e.target.checked })}
                                className="rounded border-input text-primary"
                              />
                              <span>Постійна робота з секретними відомостями (підвищений %)</span>
                            </label>
                          </div>
                        )}
                      </div>

                      {/* Класна кваліфікація */}
                      <div className="space-y-1.5 border-t pt-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={salary.hasQualification}
                            onChange={(e) => update({ hasQualification: e.target.checked })}
                            className="rounded border-input text-primary"
                          />
                          <span className="font-medium">Присвоєна класна кваліфікація</span>
                        </label>
                        {salary.hasQualification && (
                          <div className="ml-5 space-y-2 pt-1">
                            <Select
                              value={String(salary.qualificationIndex)}
                              onValueChange={(val) => update({ qualificationIndex: Number(val) })}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {QUALIFICATION_OPTIONS.map((q) => (
                                  <SelectItem key={q.index} value={String(q.index)}>
                                    {q.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            {/* Якщо медичний склад */}
                            {salary.qualificationIndex === 5 && (
                              <div className="space-y-2 rounded border bg-background p-2">
                                <Label className="text-[11px] text-muted-foreground">
                                  Кваліфікаційна категорія:
                                </Label>
                                <Select
                                  value={String(salary.medCategoryIndex)}
                                  onValueChange={(val) => update({ medCategoryIndex: Number(val) })}
                                >
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {MED_CATEGORY_OPTIONS.map((m) => (
                                      <SelectItem key={m.index} value={String(m.index)}>
                                        {m.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>

                                <Label className="text-[11px] text-muted-foreground">
                                  Медична посада:
                                </Label>
                                <Select
                                  value={String(salary.medPositionIndex)}
                                  onValueChange={(val) => update({ medPositionIndex: Number(val) })}
                                >
                                  <SelectTrigger className="h-8 text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {MED_POSITION_OPTIONS.map((p) => (
                                      <SelectItem key={p.index} value={String(p.value)}>
                                        {p.label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Шифрувальна робота */}
                      <div className="space-y-1.5 border-t pt-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={salary.hasCrypto}
                            onChange={(e) => update({ hasCrypto: e.target.checked })}
                            className="rounded border-input text-primary"
                          />
                          <span className="font-medium">Стаж на шифрувальній роботі (понад 1 рік)</span>
                        </label>
                        {salary.hasCrypto && (
                          <div className="ml-5 pt-1">
                            <Select
                              value={String(salary.cryptoIndex)}
                              onValueChange={(val) => update({ cryptoIndex: Number(val) })}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {CRYPTO_OPTIONS.map((c) => (
                                  <SelectItem key={c.index} value={String(c.index)}>
                                    {c.label} {c.percent > 0 ? `(${c.percent}%)` : ""}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      {/* Почесне звання */}
                      <div className="space-y-1.5 border-t pt-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={salary.hasHonoraryTitle}
                            onChange={(e) => update({ hasHonoraryTitle: e.target.checked })}
                            className="rounded border-input text-primary"
                          />
                          <span className="font-medium">Почесне звання («Заслужений» / «Народний»)</span>
                        </label>
                        {salary.hasHonoraryTitle && (
                          <div className="ml-5 pt-1">
                            <Select
                              value={String(salary.honoraryTitleIndex)}
                              onValueChange={(val) => update({ honoraryTitleIndex: Number(val) })}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {HONORARY_OPTIONS.map((h) => (
                                  <SelectItem key={h.index} value={String(h.index)}>
                                    {h.label} {h.percent > 0 ? `(${h.percent}%)` : ""}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      {/* Спортивне звання */}
                      <div className="space-y-1.5 border-t pt-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={salary.hasSportsTitle}
                            onChange={(e) => update({ hasSportsTitle: e.target.checked })}
                            className="rounded border-input text-primary"
                          />
                          <span className="font-medium">Спортивне звання</span>
                        </label>
                        {salary.hasSportsTitle && (
                          <div className="ml-5 pt-1">
                            <Select
                              value={String(salary.sportsTitleIndex)}
                              onValueChange={(val) => update({ sportsTitleIndex: Number(val) })}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {SPORTS_OPTIONS.map((s) => (
                                  <SelectItem key={s.index} value={String(s.index)}>
                                    {s.label} {s.percent > 0 ? `(${s.percent}%)` : ""}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      {/* Науковий ступінь */}
                      <div className="space-y-1.5 border-t pt-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={salary.hasScienceDegree}
                            onChange={(e) => update({ hasScienceDegree: e.target.checked })}
                            className="rounded border-input text-primary"
                          />
                          <span className="font-medium">Науковий ступінь (PhD / Доктор наук)</span>
                        </label>
                        {salary.hasScienceDegree && (
                          <div className="ml-5 pt-1">
                            <Select
                              value={String(salary.scienceDegreeIndex)}
                              onValueChange={(val) => update({ scienceDegreeIndex: Number(val) })}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {SCIENCE_DEGREE_OPTIONS.map((s) => (
                                  <SelectItem key={s.index} value={String(s.index)}>
                                    {s.label} {s.percent > 0 ? `(${s.percent}%)` : ""}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      {/* Вчене звання */}
                      <div className="space-y-1.5 border-t pt-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={salary.hasAcademicRank}
                            onChange={(e) => update({ hasAcademicRank: e.target.checked })}
                            className="rounded border-input text-primary"
                          />
                          <span className="font-medium">Вчене звання (Доцент / Професор)</span>
                        </label>
                        {salary.hasAcademicRank && (
                          <div className="ml-5 pt-1">
                            <Select
                              value={String(salary.academicRankIndex)}
                              onValueChange={(val) => update({ academicRankIndex: Number(val) })}
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {ACADEMIC_RANK_OPTIONS.map((a) => (
                                  <SelectItem key={a.index} value={String(a.index)}>
                                    {a.label} {a.percent > 0 ? `(${a.percent}%)` : ""}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Дисципліна */}
                <div className="rounded-md border p-3">
                  <label className="flex items-start gap-2 text-xs">
                    <input
                      type="checkbox"
                      checked={salary.disciplineViolation}
                      onChange={(e) => update({ disciplineViolation: e.target.checked })}
                      className="mt-0.5 rounded border-input text-destructive"
                    />
                    <div>
                      <span className="font-semibold text-foreground">
                        Порушення військової дисципліни або обов&apos;язків
                      </span>
                      <p className="text-muted-foreground">
                        Наявність доган чи невиходів на службу тягне за собою зменшення або позбавлення премії.
                      </p>
                    </div>
                  </label>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Розділ 2: Бойові та додаткові винагороди (воєнний стан) */}
          {activeSection === "combat" && (
            <Card>
              <CardHeader className="border-b bg-muted/20 px-4 py-3">
                <CardTitle className="flex items-center justify-between text-sm font-semibold">
                  <span className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-orange-500" />
                    Винагороди під час дії воєнного стану
                  </span>
                  <span className="text-xs font-normal text-muted-foreground">
                    Календарних днів у місяці: <strong>{daysInMonth}</strong>
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4 text-sm">
                {/* Вибір місяця та року */}
                <div className="grid grid-cols-2 gap-3 rounded-md border bg-muted/10 p-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-foreground">
                      Розрахунковий місяць
                    </Label>
                    <Select
                      value={String(salary.month)}
                      onValueChange={(val) => update({ month: Number(val) })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CALC_MONTHS.map((m, idx) => (
                          <SelectItem key={idx + 1} value={String(idx + 1)}>
                            {m}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-foreground">
                      Рік розрахунку
                    </Label>
                    <Select
                      value={String(salary.year)}
                      onValueChange={(val) => update({ year: Number(val) })}
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[2024, 2025, 2026, 2027, 2028].map((y) => (
                          <SelectItem key={y} value={String(y)}>
                            {y} рік
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* 100 000 грн — Бойові дії */}
                <div className="space-y-2 rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 font-medium">
                      <input
                        type="checkbox"
                        checked={salary.dv100combatEnabled}
                        onChange={(e) =>
                          update({
                            dv100combatEnabled: e.target.checked,
                            dv100combatDays: e.target.checked ? salary.dv100combatDays || daysInMonth : 0,
                          })
                        }
                        className="rounded border-input text-primary"
                      />
                      <span>Участь у бойових діях (100 000 грн/міс)</span>
                    </label>
                    <span className="text-xs text-muted-foreground">на передовій</span>
                  </div>

                  {salary.dv100combatEnabled && (
                    <div className="flex items-center gap-3 pt-1">
                      <Label className="text-xs text-muted-foreground">Кількість діб/днів:</Label>
                      <Input
                        type="number"
                        min={0}
                        max={daysInMonth}
                        value={salary.dv100combatDays}
                        onChange={(e) => update({ dv100combatDays: Number(e.target.value) })}
                        className="h-8 w-24 text-right"
                      />
                      <span className="text-xs font-semibold text-primary">
                        = {formatMoney(result.dv100combatAmount)}
                      </span>
                    </div>
                  )}
                </div>

                {/* 30 000 грн — Бойові (спеціальні) завдання */}
                <div className="space-y-2 rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 font-medium">
                      <input
                        type="checkbox"
                        checked={salary.dv30unitEnabled}
                        onChange={(e) =>
                          update({
                            dv30unitEnabled: e.target.checked,
                            dv30unitDays: e.target.checked ? salary.dv30unitDays || daysInMonth : 0,
                          })
                        }
                        className="rounded border-input text-primary"
                      />
                      <span>Бойові/спеціальні завдання (30 000 грн/міс)</span>
                    </label>
                    <span className="text-xs text-muted-foreground">в районах дій</span>
                  </div>

                  {salary.dv30unitEnabled && (
                    <div className="flex items-center gap-3 pt-1">
                      <Label className="text-xs text-muted-foreground">Кількість днів:</Label>
                      <Input
                        type="number"
                        min={0}
                        max={daysInMonth}
                        value={salary.dv30unitDays}
                        onChange={(e) => update({ dv30unitDays: Number(e.target.value) })}
                        className="h-8 w-24 text-right"
                      />
                      <span className="text-xs font-semibold text-primary">
                        = {formatMoney(result.dv30unitAmount)}
                      </span>
                    </div>
                  )}
                </div>

                {/* 50 000 грн — Пункти управління */}
                <div className="space-y-2 rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 font-medium">
                      <input
                        type="checkbox"
                        checked={salary.cat50Enabled}
                        onChange={(e) =>
                          update({
                            cat50Enabled: e.target.checked,
                            cat50Days: e.target.checked ? salary.cat50Days || daysInMonth : 0,
                          })
                        }
                        className="rounded border-input text-primary"
                      />
                      <span>Органи управління / пункти управління (50 000 грн/міс)</span>
                    </label>
                  </div>

                  {salary.cat50Enabled && (
                    <div className="flex items-center gap-3 pt-1">
                      <Label className="text-xs text-muted-foreground">Кількість днів:</Label>
                      <Input
                        type="number"
                        min={0}
                        max={daysInMonth}
                        value={salary.cat50Days}
                        onChange={(e) => update({ cat50Days: Number(e.target.value) })}
                        className="h-8 w-24 text-right"
                      />
                      <span className="text-xs font-semibold text-primary">
                        = {formatMoney(result.cat50Amount)}
                      </span>
                    </div>
                  )}
                </div>

                {/* 170 000 грн — Завдання до взводного опорного пункту */}
                <div className="space-y-2 rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 font-medium">
                      <input
                        type="checkbox"
                        checked={salary.cat170Enabled}
                        onChange={(e) =>
                          update({
                            cat170Enabled: e.target.checked,
                            cat170Days: e.target.checked ? salary.cat170Days || daysInMonth : 0,
                          })
                        }
                        className="rounded border-input text-primary"
                      />
                      <span>Завдання до взводного опорного пункту (170 000 грн/міс)</span>
                    </label>
                  </div>

                  {salary.cat170Enabled && (
                    <div className="flex items-center gap-3 pt-1">
                      <Label className="text-xs text-muted-foreground">Кількість днів:</Label>
                      <Input
                        type="number"
                        min={0}
                        max={daysInMonth}
                        value={salary.cat170Days}
                        onChange={(e) => update({ cat170Days: Number(e.target.value) })}
                        className="h-8 w-24 text-right"
                      />
                      <span className="text-xs font-semibold text-primary">
                        = {formatMoney(result.cat170Amount)}
                      </span>
                    </div>
                  )}
                </div>

                {/* 70 000 грн — Завдання до ротного опорного пункту */}
                <div className="space-y-2 rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 font-medium">
                      <input
                        type="checkbox"
                        checked={salary.cat70Enabled}
                        onChange={(e) =>
                          update({
                            cat70Enabled: e.target.checked,
                            cat70Days: e.target.checked ? salary.cat70Days || daysInMonth : 0,
                          })
                        }
                        className="rounded border-input text-primary"
                      />
                      <span>Завдання до ротного опорного пункту (70 000 грн/міс)</span>
                    </label>
                  </div>

                  {salary.cat70Enabled && (
                    <div className="flex items-center gap-3 pt-1">
                      <Label className="text-xs text-muted-foreground">Кількість днів:</Label>
                      <Input
                        type="number"
                        min={0}
                        max={daysInMonth}
                        value={salary.cat70Days}
                        onChange={(e) => update({ cat70Days: Number(e.target.value) })}
                        className="h-8 w-24 text-right"
                      />
                      <span className="text-xs font-semibold text-primary">
                        = {formatMoney(result.cat70Amount)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Штурмові дії (20 000 / 40 000 грн за добу) */}
                <div className="space-y-3 rounded-md border p-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span className="font-medium">Штурмові дії</span>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div className="rounded border bg-background p-2 space-y-1">
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={salary.stormRestoreEnabled}
                          onChange={(e) => update({ stormRestoreEnabled: e.target.checked })}
                          className="rounded border-input text-primary"
                        />
                        <span>Відновлення позицій (20 000 грн/добу)</span>
                      </label>
                      {salary.stormRestoreEnabled && (
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-xs text-muted-foreground">Діб:</span>
                          <Input
                            type="number"
                            min={0}
                            max={daysInMonth}
                            value={salary.stormRestoreDays}
                            onChange={(e) => update({ stormRestoreDays: Number(e.target.value) })}
                            className="h-7 w-20 text-right text-xs"
                          />
                        </div>
                      )}
                    </div>

                    <div className="rounded border bg-background p-2 space-y-1">
                      <label className="flex items-center gap-2 text-xs">
                        <input
                          type="checkbox"
                          checked={salary.stormCaptureEnabled}
                          onChange={(e) => update({ stormCaptureEnabled: e.target.checked })}
                          className="rounded border-input text-primary"
                        />
                        <span>Захоплення позицій (40 000 грн/добу)</span>
                      </label>
                      {salary.stormCaptureEnabled && (
                        <div className="flex items-center gap-2 pt-1">
                          <span className="text-xs text-muted-foreground">Діб:</span>
                          <Input
                            type="number"
                            min={0}
                            max={daysInMonth}
                            value={salary.stormCaptureDays}
                            onChange={(e) => update({ stormCaptureDays: Number(e.target.value) })}
                            className="h-7 w-20 text-right text-xs"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Інструкторський склад */}
                <div className="space-y-2 rounded-md border p-3">
                  <label className="flex items-center gap-2 font-medium">
                    <input
                      type="checkbox"
                      checked={salary.instructorEnabled}
                      onChange={(e) => update({ instructorEnabled: e.target.checked })}
                      className="rounded border-input text-primary"
                    />
                    <span>Посада інструкторського складу</span>
                  </label>

                  {salary.instructorEnabled && (
                    <div className="ml-5 space-y-2 pt-1 text-xs">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={salary.insCommanderEnabled}
                            onChange={(e) => update({ insCommanderEnabled: e.target.checked })}
                          />
                          <span>Командир підрозділу інструкторів (25 000 грн)</span>
                        </label>
                        {salary.insCommanderEnabled && (
                          <Input
                            type="number"
                            min={0}
                            max={daysInMonth}
                            value={salary.insCommanderDays}
                            onChange={(e) => update({ insCommanderDays: Number(e.target.value) })}
                            className="h-7 w-20 text-right"
                          />
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={salary.insBasicEnabled}
                            onChange={(e) => update({ insBasicEnabled: e.target.checked })}
                          />
                          <span>Базовий рівень (15 000 грн)</span>
                        </label>
                        {salary.insBasicEnabled && (
                          <Input
                            type="number"
                            min={0}
                            max={daysInMonth}
                            value={salary.insBasicDays}
                            onChange={(e) => update({ insBasicDays: Number(e.target.value) })}
                            className="h-7 w-20 text-right"
                          />
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={salary.insMediumEnabled}
                            onChange={(e) => update({ insMediumEnabled: e.target.checked })}
                          />
                          <span>Середній сержантський + підвищений інструкторський (25 000 грн)</span>
                        </label>
                        {salary.insMediumEnabled && (
                          <Input
                            type="number"
                            min={0}
                            max={daysInMonth}
                            value={salary.insMediumDays}
                            onChange={(e) => update({ insMediumDays: Number(e.target.value) })}
                            className="h-7 w-20 text-right"
                          />
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={salary.insAdvancedEnabled}
                            onChange={(e) => update({ insAdvancedEnabled: e.target.checked })}
                          />
                          <span>Підвищений сержантський + академічний (30 000 грн)</span>
                        </label>
                        {salary.insAdvancedEnabled && (
                          <Input
                            type="number"
                            min={0}
                            max={daysInMonth}
                            value={salary.insAdvancedDays}
                            onChange={(e) => update({ insAdvancedDays: Number(e.target.value) })}
                            className="h-7 w-20 text-right"
                          />
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={salary.insUbdEnabled}
                            onChange={(e) => update({ insUbdEnabled: e.target.checked })}
                          />
                          <span>Рівень не нижче базового + статус УБД (30 000 грн)</span>
                        </label>
                        {salary.insUbdEnabled && (
                          <Input
                            type="number"
                            min={0}
                            max={daysInMonth}
                            value={salary.insUbdDays}
                            onChange={(e) => update({ insUbdDays: Number(e.target.value) })}
                            className="h-7 w-20 text-right"
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Полонені вороги та знищена техніка */}
                <div className="space-y-3 rounded-md border p-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Crosshair className="h-4 w-4 text-emerald-500" />
                    <span className="font-medium text-foreground">
                      Взяття в полон ворогів та знищення живої сили противника
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded border bg-background p-2.5 space-y-1.5">
                      <span className="font-semibold text-foreground">
                        Взяття в полон (100 000 грн за особу)
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Кількість полонених:</span>
                        <Input
                          type="number"
                          min={0}
                          value={salary.prisonerCount}
                          onChange={(e) => update({ prisonerCount: Number(e.target.value) })}
                          className="h-7 w-16 text-right"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Кількість учасників:</span>
                        <Input
                          type="number"
                          min={1}
                          value={salary.prisonerParticipants}
                          onChange={(e) =>
                            update({ prisonerParticipants: Math.max(1, Number(e.target.value)) })
                          }
                          className="h-7 w-16 text-right"
                        />
                      </div>
                      {result.prisonerAmount > 0 && (
                        <div className="text-right font-semibold text-primary">
                          Ваша частка: {result.prisonerRewardShare}% = {formatMoney(result.prisonerAmount)}
                        </div>
                      )}
                    </div>

                    <div className="rounded border bg-background p-2.5 space-y-1.5">
                      <span className="font-semibold text-foreground">
                        Знищення живої сили (15 000 грн за особу)
                      </span>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Кількість знищених:</span>
                        <Input
                          type="number"
                          min={0}
                          value={salary.destroyedCount}
                          onChange={(e) => update({ destroyedCount: Number(e.target.value) })}
                          className="h-7 w-16 text-right"
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Кількість учасників:</span>
                        <Input
                          type="number"
                          min={1}
                          value={salary.destroyedParticipants}
                          onChange={(e) =>
                            update({ destroyedParticipants: Math.max(1, Number(e.target.value)) })
                          }
                          className="h-7 w-16 text-right"
                        />
                      </div>
                      {result.destroyedAmount > 0 && (
                        <div className="text-right font-semibold text-primary">
                          Ваша частка: {result.destroyedRewardShare}% = {formatMoney(result.destroyedAmount)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Навчання або відпустка */}
                <div className="space-y-2 rounded-md border p-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 font-medium">
                      <input
                        type="checkbox"
                        checked={salary.absenceEnabled}
                        onChange={(e) =>
                          update({
                            absenceEnabled: e.target.checked,
                            absenceDays: e.target.checked ? salary.absenceDays || 10 : 0,
                          })
                        }
                        className="rounded border-input text-primary"
                      />
                      <span>За обраний місяць були навчання або відпустка</span>
                    </label>
                  </div>

                  {salary.absenceEnabled && (
                    <div className="flex items-center gap-3 pt-1">
                      <Label className="text-xs text-muted-foreground">Днів відпустки/навчання:</Label>
                      <Input
                        type="number"
                        min={0}
                        max={daysInMonth}
                        value={salary.absenceDays}
                        onChange={(e) => update({ absenceDays: Number(e.target.value) })}
                        className="h-8 w-24 text-right"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Права частина — Результати розрахунку (5 з 12 колонок на десктопі) */}
        <div className="space-y-4 lg:col-span-5">
          {/* Головна картка підсумку «До видачі на руки» */}
          <Card className="border-primary/30 shadow-md">
            <CardHeader className="border-b bg-primary/5 px-4 py-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Сума до виплати
                </CardTitle>
                <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
                  {CALC_MONTHS[salary.month - 1]} {salary.year}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div>
                <div className="text-xs text-muted-foreground">Орієнтовно до видачі на руки</div>
                <div className="text-3xl font-extrabold tracking-tight text-primary">
                  {formatMoney(result.netPay)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t pt-3 text-xs">
                <div>
                  <div className="text-muted-foreground">Місячне ГЗ</div>
                  <div className="font-semibold text-foreground">
                    {formatMoney(result.monthlySalaryTotal)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Додаткові винагороди</div>
                  <div className="font-semibold text-foreground">
                    {formatMoney(result.additionalRewardsTotal)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Разом нараховано</div>
                  <div className="font-semibold text-foreground">
                    {formatMoney(result.grossTotal)}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground">Військовий збір (1.5%)</div>
                  <div className="font-semibold text-foreground">
                    {result.militaryTaxActual > 0
                      ? `−${formatMoney(result.militaryTaxActual)}`
                      : "0,00 ₴ (пільга)"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Деталізація нарахувань (Таблиця складових) */}
          <Card>
            <CardHeader className="border-b bg-muted/20 px-4 py-3">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Структура виплат та формули
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y text-xs">
                {rows.map((row, idx) => {
                  if (row.rowType === "divider") {
                    return (
                      <div
                        key={idx}
                        className="border-t-2 border-orange-500/40 bg-orange-500/5 px-4 py-1.5 font-semibold text-orange-700 dark:text-orange-300"
                      >
                        {row.name}
                      </div>
                    );
                  }

                  const isFinal = row.rowType === "final";
                  const isSubtotal = row.rowType === "subtotal" || row.rowType === "separator";

                  return (
                    <div
                      key={idx}
                      className={`flex flex-col gap-1 px-4 py-2.5 ${
                        isFinal
                          ? "bg-primary/10 font-bold"
                          : isSubtotal
                          ? "bg-muted/40 font-semibold"
                          : "hover:bg-muted/20"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="flex items-center gap-1.5">
                          {row.abbr && (
                            <span className="rounded bg-muted px-1 py-0.5 font-mono text-[10px] text-muted-foreground">
                              {row.abbr}
                            </span>
                          )}
                          <span className={row.error && !row.nonBlocking ? "text-destructive font-medium" : ""}>
                            {row.name}
                          </span>
                        </span>

                        {row.valueFormatted ? (
                          <span className="font-semibold text-foreground">
                            {row.valueFormatted}
                          </span>
                        ) : row.value != null ? (
                          <span
                            className={`font-semibold tabular-nums ${
                              row.negative
                                ? "text-destructive"
                                : isFinal
                                ? "text-primary text-sm font-bold"
                                : "text-foreground"
                            }`}
                          >
                            {formatMoney(row.value)}
                          </span>
                        ) : null}
                      </div>

                      {row.calc && (
                        <div className="text-[11px] text-muted-foreground font-mono">
                          {row.calc}
                        </div>
                      )}

                      {row.error && (
                        <div
                          className={`mt-1 flex items-start gap-1 text-[11px] ${
                            row.nonBlocking
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-destructive"
                          }`}
                        >
                          <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0" />
                          <span>{row.errorTooltip || row.error}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Застереження / Дисклеймер МОУ */}
          <div className="rounded-md border border-muted bg-muted/20 p-3 text-xs text-muted-foreground space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-foreground">
              <Info className="h-3.5 w-3.5 text-primary" />
              Зверніть увагу
            </div>
            <p>
              Результати розрахунку мають виключно <strong>інформаційний характер</strong> і не є офіційним платіжним документом.
              Фактичні суми нарахувань можуть відрізнятися залежно від наказів командирів, бойових розпоряджень, рішень комісій та документів, поданих до фінансової служби військової частини.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
