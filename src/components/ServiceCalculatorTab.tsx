import { LAW_URL, SERVICE_RULES, serviceRule } from "@/lib/service-rules";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";
import { DateRange, EditorRow } from "@/components/EditorRow";
import { ServiceExtraPeriod, ServiceRecord } from "@/lib/types";
import { formatPeriod, formatPlaceLine } from "@/lib/extract";
import {
  today,
  computeServiceTotals,
  formatDays360,
  periodDuration360,
} from "@/lib/service-calc";

interface ServiceCalculatorTabProps {
  records: ServiceRecord[]; // послужний список (тільки читання тут)
  extras: ServiceExtraPeriod[];
  calculationDate: string;
  onChangeCalculationDate: (date: string) => void;
  onChangeExtras: (extras: ServiceExtraPeriod[]) => void;
}

export const ServiceCalculatorTab = ({
  records,
  extras,
  onChangeExtras,
  calculationDate,
  onChangeCalculationDate,
}: ServiceCalculatorTabProps) => {
  const asOf = calculationDate || today();
  const totals = computeServiceTotals(records, extras, asOf);

  const updateExtra = (index: number, patch: Partial<ServiceExtraPeriod>) => {
    onChangeExtras(
      extras.map((extra, i) => (i === index ? { ...extra, ...patch } : extra))
    );
  };

  const addExtra = () => {
    onChangeExtras([
      ...extras,
      { startDate: "", endDate: "", coefficient: "preferential", note: "" },
    ]);
  };

  const removeExtra = (index: number) => {
    onChangeExtras(extras.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <Card>
        <CardContent className="space-y-3 p-3 text-sm">
          <p>Правила: <a className="underline" href={LAW_URL} target="_blank" rel="noreferrer">постанова КМУ № 393, редакція від 21.11.2024</a>. Це історична редакція; пізніші зміни тут не застосовуються.</p>
          <label className="flex flex-wrap items-center gap-2">Розрахувати станом на
            <Input type="date" className="w-[160px]" value={asOf} onChange={(e) => onChangeCalculationDate(e.target.value)} />
          </label>
          <p className="text-xs text-muted-foreground">Повний місяць = 30 днів; 12 місяців = 360 днів = 1 рік. Перший і останній день включаються. Для неповного місяця використовується фактичний залишок днів після повних календарних місяців. Дробові дні зберігаються в розрахунку; на екрані — до трьох знаків. № 393 визначає підстави зарахування, але не деталізує арифметику неповних місяців.</p>
          <p className="text-xs text-muted-foreground">Пільги п. 3 збільшують вислугу для визначення розміру пенсії. Результат не встановлює права на пенсію автоматично й не розраховує надбавку до грошового забезпечення. Для відомчих, іноземних і раніше обчислених періодів потрібні відповідні акти та документи (п. 1, 4, 5).</p>
        </CardContent>
      </Card>
      {totals.warnings.length > 0 && <div role="alert" className="rounded-md border border-destructive/40 p-3 text-sm"><ul className="list-disc space-y-1 pl-4">{totals.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></div>}
      <Card className="overflow-hidden rounded-md border bg-card shadow-sm">
        <CardHeader className="border-b bg-muted/30 px-3 py-2">
          <CardTitle className="text-sm font-semibold text-foreground">
            Календарна вислуга (з послужного списку)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          {records.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Послужний список порожній. Внесіть службу на вкладці «Послужний список» або додайте підтверджені періоди нижче.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-9">№</TableHead>
                  <TableHead className="w-[220px]">Період</TableHead>
                  <TableHead>Посада, місце служби</TableHead>
                  <TableHead className="w-[140px]">Тривалість</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record, index) => {
                  const duration = periodDuration360(
                    record.startDate,
                    record.endDate
                  );
                  return (
                    <TableRow key={index}>
                      <TableCell className="text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {formatPeriod(record)}
                      </TableCell>
                      <TableCell>{formatPlaceLine(record)}</TableCell>
                      <TableCell className="whitespace-nowrap font-medium">
                        {duration !== null ? formatDays360(duration) : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            Ці періоди редагуються на вкладці «Послужний список». Таблиця показує повну тривалість записів; підсумок обмежений датою розрахунку та враховує додаткові періоди нижче. Дні рахуються включно з першим і
            останнім (01.01.2021 – 03.01.2021 = 3 дні), дні на стиках періодів
            не дублюються.
          </p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-md border bg-card shadow-sm">
        <CardHeader className="border-b bg-muted/30 px-3 py-2">
          <CardTitle className="text-sm font-semibold text-foreground">
            Інші види вислуги
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          {extras.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Додайте іншу календарну службу ×1, пільгові періоди ×3, ×2, ×1,5, місяць за 40 днів, навчання ×0,5 або документально обґрунтовані виключення.
            </p>
          ) : (
            <div className="space-y-2">
              {extras.map((extra, index) => (
                <EditorRow
                  key={index}
                  onRemove={() => removeExtra(index)}
                  removeLabel="Видалити період"
                >
                  <DateRange
                    startDate={extra.startDate}
                    endDate={extra.endDate}
                    onChange={(patch) => updateExtra(index, patch)}
                  />
                  <div className="grid gap-2 sm:grid-cols-[minmax(240px,1fr)_2fr]">
                    <Select
                      value={extra.coefficient}
                      onValueChange={(value) =>
                        updateExtra(index, {
                          coefficient:
                            value as ServiceExtraPeriod["coefficient"],
                        })
                      }
                    >
                      <SelectTrigger aria-label={`Коефіцієнт періоду ${index + 1}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {SERVICE_RULES.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={extra.note || ""}
                      aria-label={`Підстава періоду ${index + 1}`}
                      placeholder="Підстава: пункт, наказ / довідка, номер і дата"
                      onChange={(e) =>
                        updateExtra(index, { note: e.target.value })
                      }
                    />
                  </div>
                  <p className="text-xs text-muted-foreground"><strong>{serviceRule(extra.coefficient)?.reference}.</strong> {serviceRule(extra.coefficient)?.description}</p>
                  {extra.coefficient === "study" && <label className="flex items-start gap-2 text-xs">
                    <input type="checkbox" checked={extra.studyEligible === true} onChange={(e) => updateExtra(index, { studyEligible: e.target.checked })} />
                    <span>Підтверджую умови п. 2: належна категорія особи та заклад освіти, навчання до вступу на службу / призначення на відповідну посаду, призначення пенсії за п. «а» ч. 1 ст. 12.</span>
                  </label>}
                </EditorRow>
              ))}
            </div>
          )}

          <Button variant="outline" size="sm" className="mt-3" onClick={addExtra}>
            <Plus className="mr-1 h-4 w-4" />
            Додати період
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            За п. 3¹ при перетині пільгових підстав береться найбільший коефіцієнт: вони не додаються й не перемножуються. Пільговий період уже включає календарну частину ×1. Навчання не дублює службу. Виключення ×0 мають пріоритет і зменшують лише наявні періоди. Вкажіть у кожному рядку документальну підставу та лише дати, на які вона поширюється.
          </p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-md border bg-card shadow-sm">
        <CardHeader className="border-b bg-muted/30 px-3 py-2">
          <CardTitle className="text-sm font-semibold text-foreground">
            Підсумок вислуги
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 p-3 sm:grid-cols-4">
          <div>
            <div className="text-xs text-muted-foreground">Служба / робота ×1</div>
            <div className="text-sm font-semibold">
              {formatDays360(totals.calendarTotal)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">
              Пільгова (додатково)
            </div>
            <div className="text-sm font-semibold">
              {formatDays360(totals.preferentialBonus)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">
              Навчання (зараховано)
            </div>
            <div className="text-sm font-semibold">
              {formatDays360(totals.studyCounted)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Для розміру пенсії</div>
            <div className="text-base font-bold text-primary">
              {formatDays360(totals.grandTotal)}
            </div>
          </div>
          <p className="col-span-full text-sm">За п. 1, 2, 2¹ (без пільгового збільшення): <strong>{formatDays360(totals.appointmentTotal)}</strong> = служба / робота + зараховане навчання. Для розміру пенсії додатково враховано пільгове збільшення.</p>
          {totals.excluded > 0 && (
            <p className="col-span-full text-xs text-muted-foreground">
              Виключено періодами ×0: {formatDays360(totals.excluded)}.
            </p>
          )}
          {totals.studyCapped && (
            <p className="col-span-full text-xs text-muted-foreground">
              Застосовано спільний для всіх періодів ліміт: 5 років навчання ×0,5 = максимум 2 роки 6 місяців зарахованої вислуги (п. 2).
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
