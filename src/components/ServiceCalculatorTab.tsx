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
  computeServiceTotals,
  formatDays360,
  periodDuration360,
} from "@/lib/service-calc";

interface ServiceCalculatorTabProps {
  records: ServiceRecord[]; // послужний список (тільки читання тут)
  extras: ServiceExtraPeriod[];
  onChangeExtras: (extras: ServiceExtraPeriod[]) => void;
}

const EXTRA_COEFFICIENT_OPTIONS: {
  value: ServiceExtraPeriod["coefficient"];
  label: string;
}[] = [
  { value: "preferential", label: "Пільгова (×3)" },
  { value: "study", label: "Навчання (×0,5)" },
  { value: "none", label: "Не зараховується (×0)" },
];

export const ServiceCalculatorTab = ({
  records,
  extras,
  onChangeExtras,
}: ServiceCalculatorTabProps) => {
  const totals = computeServiceTotals(records, extras);

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
      <Card className="overflow-hidden rounded-md border bg-card shadow-sm">
        <CardHeader className="border-b bg-muted/30 px-3 py-2">
          <CardTitle className="text-sm font-semibold text-foreground">
            Календарна вислуга (з послужного списку)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3">
          {records.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              Послужний список порожній — календарна вислуга формується з його
              періодів на вкладці «Послужний список».
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
            Календарна вислуга не редагується — вона формується автоматично з
            періодів послужного списку. Дні рахуються включно з першим і
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
              Додаткових періодів немає. Тут додаються пільгова вислуга (×3),
              навчання (×0,5) та періоди, що не зараховуються (×0).
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
                  <div className="grid gap-2 sm:grid-cols-[200px_1fr]">
                    <Select
                      value={extra.coefficient}
                      onValueChange={(value) =>
                        updateExtra(index, {
                          coefficient:
                            value as ServiceExtraPeriod["coefficient"],
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {EXTRA_COEFFICIENT_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={extra.note || ""}
                      placeholder="Напр., участь у бойових діях"
                      onChange={(e) =>
                        updateExtra(index, { note: e.target.value })
                      }
                    />
                  </div>
                </EditorRow>
              ))}
            </div>
          )}

          <Button variant="outline" size="sm" className="mt-3" onClick={addExtra}>
            <Plus className="mr-1 h-4 w-4" />
            Додати період
          </Button>
          <p className="mt-2 text-xs text-muted-foreground">
            При пересіканні з календарною вислугою день рахується за більшим
            коефіцієнтом (пільгова ×3 перекриває календарну ×1). Періоди «не
            зараховується» (×0) виключають дні повністю.
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
            <div className="text-xs text-muted-foreground">Календарна</div>
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
            <div className="text-xs text-muted-foreground">Разом вислуга</div>
            <div className="text-base font-bold text-primary">
              {formatDays360(totals.grandTotal)}
            </div>
          </div>
          {totals.excluded > 0 && (
            <p className="col-span-full text-xs text-muted-foreground">
              Виключено періодами ×0: {formatDays360(totals.excluded)}.
            </p>
          )}
          {totals.studyCapped && (
            <p className="col-span-full text-xs text-muted-foreground">
              До вислуги зараховано не більше 5 років навчання (п.2 Постанови
              КМУ № 393): 1 рік навчання — 6 місяців служби.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
