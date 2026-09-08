import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface HowToProps {
  open: boolean;
  onClose: () => void;
}

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

export const HowTo = ({ open, onClose }: HowToProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // <dialog> керується імперативно: showModal() дає top layer, фокус-трап і Escape
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        // клік по підкладці приходить на сам <dialog>, а не на його вміст
        if (e.target === dialogRef.current) onClose();
      }}
      className="m-auto w-[min(44rem,calc(100vw-1.5rem))] rounded-lg border bg-card p-0 text-card-foreground shadow-lg backdrop:bg-[hsl(0_0%_10%/0.6)]"
    >
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h2 className="text-sm font-semibold">Як користуватись</h2>
        <button
          type="button"
          aria-label="Закрити"
          className="rounded-sm text-muted-foreground hover:text-foreground"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-4 py-4">
        <ol className="space-y-3">
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
        <p className="mt-4 border-t pt-3 text-xs text-muted-foreground">
          Усе введене зберігається автоматично в цьому браузері й нікуди не
          надсилається — можна закрити вкладку й повернутись пізніше. «Зберегти
          у файл» потрібне лише щоб перенести дані на інший комп'ютер або
          зробити резервну копію, «Відкрити файл» — щоб повернути їх назад.
        </p>
      </div>

      <div className="flex justify-end border-t px-4 py-3">
        <Button size="sm" onClick={onClose}>
          Зрозуміло
        </Button>
      </div>
    </dialog>
  );
};
