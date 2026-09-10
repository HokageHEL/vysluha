import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateRange, EditorRow } from "@/components/EditorRow";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SERVICE_RULES } from "@/lib/service-rules";
import { SimpleServicePeriod } from "@/lib/types";
import { computeServiceTotals, formatDays360, today } from "@/lib/service-calc";
import { Plus } from "lucide-react";

const SIMPLE_RULES = SERVICE_RULES.filter(
  (rule) => rule.value !== "study" && rule.value !== "none",
);

interface SimpleCalculatorProps {
  periods: SimpleServicePeriod[];
  calculationDate: string;
  onChangePeriods: (periods: SimpleServicePeriod[]) => void;
  onChangeCalculationDate: (date: string) => void;
}

export const SimpleCalculator = ({
  periods,
  calculationDate,
  onChangePeriods,
  onChangeCalculationDate,
}: SimpleCalculatorProps) => {
  const asOf = calculationDate || today();
  const totals = computeServiceTotals([], periods, asOf);
  const update = (index: number, patch: Partial<SimpleServicePeriod>) =>
    onChangePeriods(periods.map((period, i) => i === index ? { ...period, ...patch } : period));

  return (
    <div className="space-y-3">
      <Card>
        <CardContent className="space-y-3 p-4 text-sm">
          <div>
            <h2 className="font-semibold">Швидкий розрахунок вислуги</h2>
            <p className="mt-1 text-muted-foreground">Вкажіть лише дати кожного періоду та коефіцієнт. Дані зберігаються у вашому браузері.</p>
          </div>
          <label className="flex flex-wrap items-center gap-2">Розрахувати станом на
            <Input type="date" className="w-[160px]" value={asOf} onChange={(e) => onChangeCalculationDate(e.target.value)} />
          </label>
        </CardContent>
      </Card>

      {totals.warnings.length > 0 && <div role="alert" className="rounded-md border border-destructive/40 p-3 text-sm"><ul className="list-disc space-y-1 pl-4">{totals.warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></div>}

      <Card>
        <CardHeader className="border-b bg-muted/30 px-4 py-3">
          <CardTitle className="text-sm">Періоди служби</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {periods.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">Додайте перший період, щоб побачити розрахунок.</p>
          ) : (
            <div className="space-y-2">
              {periods.map((period, index) => (
                <EditorRow key={index} onRemove={() => onChangePeriods(periods.filter((_, i) => i !== index))} removeLabel="Видалити період">
                  <DateRange startDate={period.startDate} endDate={period.endDate} onChange={(patch) => update(index, patch)} />
                  <Select value={period.coefficient} onValueChange={(value) => update(index, { coefficient: value as SimpleServicePeriod["coefficient"] })}>
                    <SelectTrigger aria-label={`Коефіцієнт періоду ${index + 1}`}><SelectValue /></SelectTrigger>
                    <SelectContent>{SIMPLE_RULES.map((rule) => <SelectItem key={rule.value} value={rule.value}>{rule.label}</SelectItem>)}</SelectContent>
                  </Select>
                </EditorRow>
              ))}
            </div>
          )}
          <Button variant="outline" size="sm" className="mt-3" onClick={() => onChangePeriods([...periods, { startDate: "", endDate: "", coefficient: "calendar" }])}>
            <Plus className="mr-1 h-4 w-4" /> Додати період
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b bg-muted/30 px-4 py-3"><CardTitle className="text-sm">Підсумок вислуги</CardTitle></CardHeader>
        <CardContent className="grid gap-3 p-4 sm:grid-cols-3">
          <div><div className="text-xs text-muted-foreground">Календарна</div><div className="text-sm font-semibold">{formatDays360(totals.calendarTotal)}</div></div>
          <div><div className="text-xs text-muted-foreground">Пільгова (додатково)</div><div className="text-sm font-semibold">{formatDays360(totals.preferentialBonus)}</div></div>
          <div><div className="text-xs text-muted-foreground">Усього</div><div className="text-base font-bold text-primary">{formatDays360(totals.grandTotal)}</div></div>
        </CardContent>
      </Card>
    </div>
  );
};
