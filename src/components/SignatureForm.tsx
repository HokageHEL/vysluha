import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RankSelect } from "@/components/RankSelect";
import { buildSignatureLines } from "@/lib/extract";
import { SignatureBlock } from "@/lib/types";
import { cn } from "@/lib/utils";

interface SignatureFormProps {
  signature: SignatureBlock;
  onChange: (signature: SignatureBlock) => void;
}

export const SignatureForm = ({ signature, onChange }: SignatureFormProps) => {
  const set = (patch: Partial<SignatureBlock>) =>
    onChange({ ...signature, ...patch });
  const preview = buildSignatureLines(signature);

  return (
    <Card className="rounded-md border bg-card shadow-sm">
      <CardHeader className="rounded-t-md border-b bg-muted/30 px-3 py-2">
        <CardTitle className="text-sm font-semibold text-foreground">
          Підпис витягу
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 p-3">
        <div className="grid gap-3 lg:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="signPosition" className="text-xs">
              Посада того, хто підписує
            </Label>
            <Textarea
              id="signPosition"
              rows={3}
              value={signature.positionLines}
              placeholder={
                "Начальник відділу персоналу\nвійськової частини А0000"
              }
              onChange={(e) => set({ positionLines: e.target.value })}
            />
          </div>
          <div className="grid content-start gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="signRank" className="text-xs">
                Звання підписанта
              </Label>
              <RankSelect
                id="signRank"
                value={signature.rank}
                placeholder="полковник"
                onChange={(rank) => set({ rank })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="signName" className="text-xs">
                Ім'я та ПРІЗВИЩЕ підписанта
              </Label>
              <Input
                id="signName"
                value={signature.name}
                placeholder="Іван КОВАЛЕНКО"
                onChange={(e) => set({ name: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="executor" className="text-xs">
                Виконавець
              </Label>
              <Input
                id="executor"
                value={signature.executor}
                placeholder="Олена Ткаченко"
                onChange={(e) => set({ executor: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="executorPhone" className="text-xs">
                Телефон виконавця
              </Label>
              <Input
                id="executorPhone"
                inputMode="tel"
                value={signature.executorPhone}
                placeholder="0000000000"
                onChange={(e) => set({ executorPhone: e.target.value })}
              />
            </div>
          </div>
        </div>

        <p
          className={cn(
            "text-xs",
            preview.incomplete
              ? "font-medium text-destructive"
              : "text-muted-foreground",
          )}
        >
          {preview.incomplete
            ? "Підпис заповнено не повністю — у документ підуть підказки в дужках, їх треба замінити перед друком."
            : "Звання зліва, прізвище справа — між ними лишається місце для підпису."}
        </p>
      </CardContent>
    </Card>
  );
};
