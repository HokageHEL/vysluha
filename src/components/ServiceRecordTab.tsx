import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  FileSpreadsheet,
  FileText,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import { ServiceRecord } from "@/lib/types";
import {
  ServiceExtractPerson,
  buildPersonLine,
  exportServiceRecordExcel,
  exportServiceRecordWord,
  formatPeriod,
  formatPlaceLine,
} from "@/lib/exportServiceRecord";
import { formatDays360, periodDuration360 } from "@/lib/service-calc";
import { cn } from "@/lib/utils";

interface ServiceRecordTabProps {
  person: ServiceExtractPerson;
  records: ServiceRecord[];
  onChange: (records: ServiceRecord[]) => void;
  readOnly?: boolean;
}

export const ServiceRecordTab = ({
  person,
  records,
  onChange,
  readOnly,
}: ServiceRecordTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);
  const editing = isEditing && !readOnly;

  const updateRecord = (
    index: number,
    field: keyof ServiceRecord,
    value: string
  ) => {
    onChange(
      records.map((record, i) =>
        i === index ? { ...record, [field]: value } : record
      )
    );
  };

  const addRecord = () => {
    // Новий період продовжує попередній (послужний список зазвичай безперервний)
    const last = records[records.length - 1];
    onChange([
      ...records,
      {
        startDate: last?.endDate || "",
        endDate: "",
        position: "",
        vos: "",
        place: "",
      },
    ]);
  };

  const removeRecord = (index: number) => {
    onChange(records.filter((_, i) => i !== index));
  };

  const handleExportWord = async () => {
    setExportError(null);
    try {
      await exportServiceRecordWord(person, records);
    } catch {
      setExportError("Не вдалося створити документ Word");
    }
  };

  const handleExportExcel = async () => {
    setExportError(null);
    try {
      await exportServiceRecordExcel(person, records);
    } catch {
      setExportError("Не вдалося створити файл Excel");
    }
  };

  return (
    <Card className="overflow-hidden rounded-md border bg-card shadow-sm">
      <CardHeader className="flex-row items-center justify-between space-y-0 border-b bg-muted/30 px-3 py-2">
        <CardTitle className="text-sm font-semibold text-foreground">
          Послужний список
        </CardTitle>
        <div className="flex items-center gap-1.5">
          <Button variant="outline" size="sm" onClick={handleExportWord}>
            <FileText className="mr-1 h-3.5 w-3.5" />
            Word
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportExcel}>
            <FileSpreadsheet className="mr-1 h-3.5 w-3.5" />
            Excel
          </Button>
          {!readOnly && (
            <Button
              variant={editing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditing((v) => !v)}
            >
              {editing ? (
                <>
                  <Eye className="mr-1 h-3.5 w-3.5" />
                  Перегляд
                </>
              ) : (
                <>
                  <Pencil className="mr-1 h-3.5 w-3.5" />
                  Редагувати
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-3">
        {exportError && (
          <p className="mb-2 text-sm text-destructive">{exportError}</p>
        )}
        {editing ? (
          <>
            {records.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Періодів служби ще немає. Додайте перший період послужного
                списку.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <Table className="table-fixed" style={{ minWidth: 1500 }}>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-9">№</TableHead>
                      <TableHead className="w-[150px]">Початок</TableHead>
                      <TableHead className="w-[150px]">Кінець</TableHead>
                      <TableHead className="w-[220px]">Посада</TableHead>
                      <TableHead className="w-[110px]">ВОС</TableHead>
                      <TableHead>Місце служби</TableHead>
                      <TableHead className="w-[170px]">
                        Наказ на призначення
                      </TableHead>
                      <TableHead className="w-[170px]">
                        Наказ про зарахування
                      </TableHead>
                      <TableHead className="w-[170px]">
                        Наказ на виключення
                      </TableHead>
                      <TableHead className="w-[115px]">Тривалість</TableHead>
                      <TableHead className="w-10" />
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
                          <TableCell className="align-top pt-3 text-muted-foreground">
                            {index + 1}
                          </TableCell>
                          <TableCell className="align-top">
                            <Input
                              type="date"
                              className="w-[140px]"
                              value={record.startDate}
                              onChange={(e) =>
                                updateRecord(index, "startDate", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell className="align-top">
                            <Input
                              type="date"
                              className="w-[140px]"
                              value={record.endDate}
                              onChange={(e) =>
                                updateRecord(index, "endDate", e.target.value)
                              }
                            />
                            <span
                              className={cn(
                                "block h-4 text-[10px] leading-4 text-muted-foreground",
                                record.endDate && "invisible"
                              )}
                            >
                              по т.ч.
                            </span>
                          </TableCell>
                          <TableCell className="align-top">
                            <Input
                              value={record.position || ""}
                              placeholder="Посада"
                              onChange={(e) =>
                                updateRecord(index, "position", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell className="align-top">
                            <Input
                              value={record.vos || ""}
                              placeholder="ВОС"
                              onChange={(e) =>
                                updateRecord(index, "vos", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell className="align-top">
                            <Input
                              value={record.place}
                              placeholder="Військова частина, установа"
                              onChange={(e) =>
                                updateRecord(index, "place", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell className="space-y-1 align-top">
                            <Input
                              value={record.appointmentOrderNumber || ""}
                              placeholder="№ наказу"
                              onChange={(e) =>
                                updateRecord(
                                  index,
                                  "appointmentOrderNumber",
                                  e.target.value
                                )
                              }
                            />
                            <Input
                              type="date"
                              value={record.appointmentOrderDate || ""}
                              onChange={(e) =>
                                updateRecord(index, "appointmentOrderDate", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell className="space-y-1 align-top">
                            <Input
                              value={record.enrollmentOrderNumber || ""}
                              placeholder="№ наказу"
                              onChange={(e) =>
                                updateRecord(
                                  index,
                                  "enrollmentOrderNumber",
                                  e.target.value
                                )
                              }
                            />
                            <Input
                              type="date"
                              value={record.enrollmentOrderDate || ""}
                              onChange={(e) =>
                                updateRecord(index, "enrollmentOrderDate", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell className="space-y-1 align-top">
                            <Input
                              value={record.dismissalOrderNumber || ""}
                              placeholder="№ наказу"
                              onChange={(e) =>
                                updateRecord(
                                  index,
                                  "dismissalOrderNumber",
                                  e.target.value
                                )
                              }
                            />
                            <Input
                              type="date"
                              value={record.dismissalOrderDate || ""}
                              onChange={(e) =>
                                updateRecord(index, "dismissalOrderDate", e.target.value)
                              }
                            />
                          </TableCell>
                          <TableCell className="align-top pt-3 whitespace-nowrap text-sm">
                            {duration !== null ? formatDays360(duration) : "—"}
                          </TableCell>
                          <TableCell className="align-top">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive"
                              onClick={() => removeRecord(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}

            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={addRecord}
            >
              <Plus className="mr-1 h-4 w-4" />
              Додати період
            </Button>
          </>
        ) : (
          /* Режим перегляду — 1в1 як експортований витяг */
          <div className="mx-auto max-w-4xl py-4 font-serif">
            <p className="text-center text-base">ВИТЯГ З ПОСЛУЖНОГО СПИСКУ</p>
            <p className="mt-4 text-base underline">{buildPersonLine(person)}</p>
            {records.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground font-sans">
                Послужний список порожній.
                {!readOnly && " Натисніть «Редагувати», щоб додати періоди."}
              </p>
            ) : (
              <table className="mt-3 w-full border-collapse text-sm">
                <tbody>
                  {records.map((record, index) => (
                    <tr key={index}>
                      <td className="w-[190px] border border-border px-2 py-0.5 align-top whitespace-nowrap">
                        {formatPeriod(record)}
                      </td>
                      <td className="border border-border px-2 py-0.5 text-justify align-middle">
                        {formatPlaceLine(record)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
