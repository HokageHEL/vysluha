import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileSpreadsheet, FileText, Plus } from "lucide-react";
import { DateRange, EditorRow } from "@/components/EditorRow";
import { EventTemplateMenu } from "@/components/EventTemplateMenu";
import {
  ServiceEvent,
  ServiceExtractPerson,
  ServiceRecord,
  SignatureBlock,
} from "@/lib/types";
import {
  exportServiceRecordExcel,
  exportServiceRecordWord,
} from "@/lib/exportServiceRecord";
import {
  buildExtractRows,
  buildHeaderName,
  buildHeaderService,
  buildSignatureLines,
  periodDates,
  splitLines,
} from "@/lib/extract";

interface ServiceRecordTabProps {
  person: ServiceExtractPerson;
  records: ServiceRecord[];
  events: ServiceEvent[];
  signature: SignatureBlock;
  onChangeRecords: (records: ServiceRecord[]) => void;
  onChangeEvents: (events: ServiceEvent[]) => void;
}

export const ServiceRecordTab = ({
  person,
  records,
  events,
  signature,
  onChangeRecords,
  onChangeEvents,
}: ServiceRecordTabProps) => {
  const [exportError, setExportError] = useState<string | null>(null);

  // Періоди й події живуть окремо, але редагуються та друкуються
  // одним хронологічним списком
  const rows = buildExtractRows(records, events);

  const updateRecord = (index: number, patch: Partial<ServiceRecord>) =>
    onChangeRecords(
      records.map((record, i) =>
        i === index ? { ...record, ...patch } : record,
      ),
    );

  const updateEvent = (index: number, patch: Partial<ServiceEvent>) =>
    onChangeEvents(
      events.map((event, i) => (i === index ? { ...event, ...patch } : event)),
    );

  const addRecord = () => {
    // Новий період продовжує попередній (послужний список зазвичай безперервний)
    const last = records[records.length - 1];
    onChangeRecords([
      ...records,
      { startDate: last?.endDate || "", endDate: "", position: "", place: "" },
    ]);
  };

  // Запис вклинюється саме в той проміжок, де натиснули: місце в документі
  // визначає дата, тому беремо дату межі між сусідніми рядками
  const addEventAt = (date: string) =>
    onChangeEvents([...events, { date, text: "" }]);

  const exportWith = async (
    exporter: (doc: {
      person: ServiceExtractPerson;
      records: ServiceRecord[];
      events: ServiceEvent[];
      signature: SignatureBlock;
    }) => Promise<void>,
    message: string,
  ) => {
    setExportError(null);
    try {
      await exporter({ person, records, events, signature });
    } catch {
      setExportError(message);
    }
  };

  const sign = buildSignatureLines(signature);

  const insertBar = (date: string, key: string) => (
    <button
      key={key}
      type="button"
      className="group flex w-full items-center gap-2 py-0.5 text-[11px] text-muted-foreground hover:text-foreground"
      onClick={() => addEventAt(date)}
    >
      <span className="h-px flex-1 bg-border group-hover:bg-foreground/30" />
      <span className="whitespace-nowrap">+ запис про контракт чи призов</span>
      <span className="h-px flex-1 bg-border group-hover:bg-foreground/30" />
    </button>
  );

  return (
    <div className="grid gap-3 xl:grid-cols-2">
      <Card className="rounded-md border bg-card shadow-sm">
        <CardHeader className="flex-row items-center justify-between space-y-0 rounded-t-md border-b bg-muted/30 px-3 py-2">
          <CardTitle className="text-sm font-semibold text-foreground">
            Послужний список
          </CardTitle>
          <Button variant="outline" size="sm" onClick={addRecord}>
            <Plus className="mr-1 h-3.5 w-3.5" />
            Додати період
          </Button>
        </CardHeader>
        <CardContent className="space-y-1 p-3">
          {rows.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              Періодів служби ще немає. Почніть із кнопки «Додати період» —
              праворуч одразу видно, як виглядатиме витяг.
            </p>
          ) : (
            <>
              {insertBar(rows[0].kind === "period"
                ? rows[0].record.startDate
                : rows[0].event.date, "top")}
              {rows.map((row, i) => {
                const next = rows[i + 1];
                // Дата межі: кінець цього періоду або початок наступного рядка
                const gapDate =
                  (row.kind === "period" && row.record.endDate) ||
                  (next
                    ? next.kind === "period"
                      ? next.record.startDate
                      : next.event.date
                    : "");

                return (
                  <div key={`${row.kind}-${row.index}`} className="space-y-1">
                    {row.kind === "period" ? (
                      <EditorRow
                        onRemove={() =>
                          onChangeRecords(
                            records.filter((_, j) => j !== row.index),
                          )
                        }
                        removeLabel="Видалити період"
                      >
                        <DateRange
                          startDate={row.record.startDate}
                          endDate={row.record.endDate}
                          onChange={(patch) => updateRecord(row.index, patch)}
                        />
                        <Input
                          value={row.record.position}
                          placeholder="Займана посада"
                          onChange={(e) =>
                            updateRecord(row.index, {
                              position: e.target.value,
                            })
                          }
                        />
                        <Input
                          value={row.record.place}
                          placeholder="Місце проходження служби"
                          onChange={(e) =>
                            updateRecord(row.index, { place: e.target.value })
                          }
                        />
                      </EditorRow>
                    ) : (
                      <EditorRow
                        dashed
                        onRemove={() =>
                          onChangeEvents(
                            events.filter((_, j) => j !== row.index),
                          )
                        }
                        removeLabel="Видалити запис"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <Input
                            type="date"
                            className="w-[150px]"
                            value={row.event.date}
                            onChange={(e) =>
                              updateEvent(row.index, { date: e.target.value })
                            }
                          />
                          <EventTemplateMenu
                            date={row.event.date}
                            onPick={(text) => updateEvent(row.index, { text })}
                          />
                        </div>
                        <Textarea
                          rows={3}
                          value={row.event.text}
                          placeholder="Призов по мобілізації, укладення чи продовження контракту"
                          onChange={(e) =>
                            updateEvent(row.index, { text: e.target.value })
                          }
                        />
                      </EditorRow>
                    )}
                    {insertBar(gapDate, `gap-${i}`)}
                  </div>
                );
              })}
            </>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-md border bg-card shadow-sm">
        <CardHeader className="flex-row items-center justify-between space-y-0 rounded-t-md border-b bg-muted/30 px-3 py-2">
          <CardTitle className="text-sm font-semibold text-foreground">
            Передперегляд витягу
          </CardTitle>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                exportWith(
                  exportServiceRecordWord,
                  "Не вдалося створити документ Word",
                )
              }
            >
              <FileText className="mr-1 h-3.5 w-3.5" />
              Word
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                exportWith(
                  exportServiceRecordExcel,
                  "Не вдалося створити файл Excel",
                )
              }
            >
              <FileSpreadsheet className="mr-1 h-3.5 w-3.5" />
              Excel
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3">
          {exportError && (
            <p className="mb-2 text-sm text-destructive">{exportError}</p>
          )}
          <div className="font-serif xl:sticky xl:top-3">
            <p className="text-center text-base font-bold">
              ВИТЯГ З ПОСЛУЖНОГО СПИСКУ
            </p>
            <p className="mt-3 text-center text-base font-bold underline">
              {buildHeaderName(person)}
            </p>
            <p className="text-center text-base">
              {buildHeaderService(person)}
            </p>
            {splitLines(person.contractNote).map((text, i) => (
              <p key={i} className="text-center text-base">
                {text}
              </p>
            ))}

            {rows.length > 0 && (
              <table className="mt-3 w-full table-fixed border-collapse text-sm">
                <colgroup>
                  <col className="w-[20.6%]" />
                  <col className="w-[54.7%]" />
                  <col className="w-[24.7%]" />
                </colgroup>
                <thead>
                  <tr>
                    {[
                      "Терміни проходження служби",
                      "Займана посада",
                      "Місце проходження служби",
                    ].map((title) => (
                      <th
                        key={title}
                        className="border border-foreground px-2 py-0.5 text-center font-bold"
                      >
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) =>
                    row.kind === "event" ? (
                      <tr key={`e${row.index}`}>
                        <td
                          colSpan={3}
                          className="border border-foreground px-2 py-0.5 text-center"
                        >
                          {splitLines(row.event.text).map((text, i) => (
                            <span key={i} className="block">
                              {text}
                            </span>
                          ))}
                        </td>
                      </tr>
                    ) : (
                      <tr key={`p${row.index}`}>
                        <td className="border border-foreground px-2 py-0.5 text-center align-middle">
                          {periodDates(row.record).map((date) => (
                            <span key={date} className="block">
                              {date}
                            </span>
                          ))}
                        </td>
                        <td className="border border-foreground px-2 py-0.5 text-justify align-middle">
                          {row.record.position}
                        </td>
                        <td className="border border-foreground px-2 py-0.5 text-center align-middle">
                          {row.record.place}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            )}

            <div className="mt-8 text-base">
              {sign.positionLines.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
              <p className="flex justify-between gap-8">
                <span>{sign.rank}</span>
                <span>{sign.name}</span>
              </p>
              <p className="mt-10 text-[0.55rem] leading-tight">
                {sign.executor}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
