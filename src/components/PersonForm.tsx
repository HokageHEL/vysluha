import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RankSelect } from "@/components/RankSelect";
import { RotateCcw } from "lucide-react";
import { ServiceExtractPerson } from "@/lib/types";
import { suggestPersonLine } from "@/lib/extract";

interface PersonFormProps {
  person: ServiceExtractPerson;
  onChange: (person: ServiceExtractPerson) => void;
}

const NAME_FIELDS: {
  key: "lastName" | "firstName" | "middleName";
  label: string;
  placeholder: string;
}[] = [
  { key: "lastName", label: "Прізвище", placeholder: "Іваненко" },
  { key: "firstName", label: "Ім'я", placeholder: "Іван" },
  { key: "middleName", label: "По батькові", placeholder: "Іванович" },
];

export const PersonForm = ({ person, onChange }: PersonFormProps) => {
  const set = (patch: Partial<ServiceExtractPerson>) =>
    onChange({ ...person, ...patch });

  const suggestion = suggestPersonLine(person);
  const headerLine = person.headerOverride || suggestion;

  return (
    <Card className="rounded-md border bg-card shadow-sm">
      <CardHeader className="rounded-t-md border-b bg-muted/30 px-3 py-2">
        <CardTitle className="text-sm font-semibold text-foreground">
          Дані військовослужбовця
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-3">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {NAME_FIELDS.map((field) => (
            <div key={field.key} className="space-y-1">
              <Label htmlFor={field.key} className="text-xs">
                {field.label}
              </Label>
              <Input
                id={field.key}
                value={person[field.key]}
                placeholder={field.placeholder}
                onChange={(e) => set({ [field.key]: e.target.value })}
              />
            </div>
          ))}
          <div className="space-y-1">
            <Label htmlFor="militaryRank" className="text-xs">
              Військове звання
            </Label>
            <RankSelect
              id="militaryRank"
              value={person.militaryRank}
              placeholder="майор"
              onChange={(militaryRank) => set({ militaryRank })}
            />
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <Label htmlFor="birthYear" className="text-xs">
              Рік народження
            </Label>
            <Input
              id="birthYear"
              inputMode="numeric"
              value={person.birthYear}
              placeholder="1985"
              onChange={(e) => set({ birthYear: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="taxId" className="text-xs">
              РНОКПП
            </Label>
            <Input
              id="taxId"
              inputMode="numeric"
              value={person.taxId}
              placeholder="0000000000"
              onChange={(e) => set({ taxId: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="serviceStartDate" className="text-xs">
              У Збройних Силах України з
            </Label>
            <Input
              id="serviceStartDate"
              type="date"
              value={person.serviceStartDate}
              onChange={(e) => set({ serviceStartDate: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="serviceEndDate" className="text-xs">
              По (порожньо — по теперішній час)
            </Label>
            <Input
              id="serviceEndDate"
              type="date"
              value={person.serviceEndDate}
              onChange={(e) => set({ serviceEndDate: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="headerOverride" className="text-xs">
            Звання і ПІБ у родовому відмінку — перший рядок витягу
          </Label>
          <div className="flex gap-1.5">
            <Input
              id="headerOverride"
              value={headerLine}
              placeholder="майора ІВАНЕНКА Івана Івановича"
              onChange={(e) =>
                set({
                  headerOverride:
                    e.target.value === suggestion ? "" : e.target.value,
                })
              }
            />
            {person.headerOverride && (
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 shrink-0"
                title="Повернути автоматичний варіант"
                onClick={() => set({ headerOverride: "" })}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Підставляється автоматично з полів вище. Відмінювання ПІБ —
            приблизне, тому перевірте рядок і за потреби виправте руками.
          </p>
        </div>

        <div className="space-y-1">
          <Label htmlFor="contractNote" className="text-xs">
            Статус контракту — рядки під шапкою
          </Label>
          <Textarea
            id="contractNote"
            rows={2}
            value={person.contractNote}
            placeholder={
              "Контракт продовжено понад встановлені строки до оголошення демобілізації\nз 01 січня 2020 року"
            }
            onChange={(e) => set({ contractNote: e.target.value })}
          />
        </div>

      </CardContent>
    </Card>
  );
};
