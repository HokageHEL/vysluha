import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ServiceExtractPerson,
  buildPersonLine,
} from "@/lib/exportServiceRecord";

interface PersonFormProps {
  person: ServiceExtractPerson;
  onChange: (person: ServiceExtractPerson) => void;
}

const FIELDS: {
  key: keyof ServiceExtractPerson;
  label: string;
  placeholder: string;
}[] = [
  {
    key: "fullName",
    label: "Прізвище, ім'я, по батькові",
    placeholder: "Іваненко Іван Іванович",
  },
  { key: "militaryRank", label: "Військове звання", placeholder: "капітан" },
  {
    key: "position",
    label: "Посада",
    placeholder: "начальник відділення",
  },
  {
    key: "unit",
    label: "Військова частина (у родовому відмінку)",
    placeholder: "військової частини А0000",
  },
];

export const PersonForm = ({ person, onChange }: PersonFormProps) => {
  const preview = buildPersonLine(person);

  return (
    <Card className="overflow-hidden rounded-md border bg-card shadow-sm">
      <CardHeader className="border-b bg-muted/30 px-3 py-2">
        <CardTitle className="text-sm font-semibold text-foreground">
          Дані військовослужбовця
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FIELDS.map((field) => (
            <div key={field.key} className="space-y-1">
              <Label htmlFor={field.key} className="text-xs">
                {field.label}
              </Label>
              <Input
                id={field.key}
                value={person[field.key] || ""}
                placeholder={field.placeholder}
                onChange={(e) =>
                  onChange({ ...person, [field.key]: e.target.value })
                }
              />
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Рядок у витягу:{" "}
          {preview ? (
            <span className="font-medium text-foreground">{preview}</span>
          ) : (
            "заповніть поля вище"
          )}
        </p>
      </CardContent>
    </Card>
  );
};
