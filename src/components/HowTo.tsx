import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

const STEPS: { title: string; text: string }[] = [
  {
    title: "Заповніть дані військовослужбовця",
    text: "Звання, ПІБ, посада і номер військової частини — з них складається шапка витягу. Під полями одразу видно, як вийде готовий рядок.",
  },
  {
    title: "Внесіть послужний список",
    text: "Вкладка «1. Послужний список» → «Редагувати» → «Додати період» на кожне місце служби. Порожній кінець періоду означає «по теперішній час». Саме з цих періодів рахується календарна вислуга — без них далі рахувати нічого.",
  },
  {
    title: "Додайте особливі періоди, якщо вони є",
    text: "Вкладка «2. Вислуга» — сюди вносять пільгову вислугу (×3), навчання (×0,5) і періоди, що не зараховуються (×0), як-от СЗЧ. Якщо таких періодів немає, вкладку можна не чіпати: календарна вислуга вже порахована.",
  },
  {
    title: "Заберіть результат",
    text: "Підсумок вислуги — внизу вкладки «2. Вислуга». Кнопки «Word» і «Excel» на вкладці «1. Послужний список» вивантажують готовий витяг із послужного списку.",
  },
];

export const HowTo = () => (
  <Card className="rounded-md border bg-card shadow-sm">
    <CardContent className="p-0">
      <details open className="group">
        <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-sm font-semibold">
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
          Як користуватись
          <span className="ml-auto text-xs font-normal text-muted-foreground">
            згорнути / розгорнути
          </span>
        </summary>
        <div className="border-t px-3 py-3">
          <ol className="space-y-2">
            {STEPS.map((step, index) => (
              <li key={step.title} className="flex gap-2.5 text-sm">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <span>
                  <span className="font-medium">{step.title}.</span>{" "}
                  <span className="text-muted-foreground">{step.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="mt-3 border-t pt-3 text-xs text-muted-foreground">
            Усе введене зберігається автоматично в цьому браузері й нікуди не
            надсилається — можна закрити вкладку й повернутись пізніше.
            «Зберегти у файл» потрібне лише щоб перенести дані на інший
            комп'ютер або зробити резервну копію, «Відкрити файл» — щоб
            повернути їх назад.
          </p>
        </div>
      </details>
    </CardContent>
  </Card>
);
