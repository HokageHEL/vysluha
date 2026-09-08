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
    text: "Прізвище, ім'я, по батькові, звання, рік народження, РНОКПП і дата вступу на службу — з них складається шапка витягу. Рядок «звання і ПІБ у родовому відмінку» підставляється сам, але відмінювання приблизне: перевірте його й за потреби виправте.",
  },
  {
    title: "Внесіть послужний список",
    text: "Вкладка «1. Послужний список» → «Додати період» на кожне місце служби. Порожній кінець періоду означає «по теперішній час». Праворуч одразу видно готовий витяг — окремого режиму перегляду немає. Саме з цих періодів рахується календарна вислуга.",
  },
  {
    title: "Вставте записи про контракт",
    text: "Між періодами є тонка лінія «+ запис про контракт чи призов» — натисніть її в потрібному проміжку. Кнопка «Шаблон» підставить готовий текст із датою прописом. У витягу такий запис стає рядком на всю ширину таблиці, а його місце визначає дата.",
  },
  {
    title: "Заповніть підпис",
    text: "Посада, звання та прізвище того, хто підписує витяг, плюс виконавець і його телефон. Незаповнені поля друкуються підказкою в дужках — щоб їх не проґавили перед друком.",
  },
  {
    title: "Додайте особливі періоди, якщо вони є",
    text: "Вкладка «2. Вислуга» — сюди вносять пільгову вислугу (×3), навчання (×0,5) і періоди, що не зараховуються (×0), як-от СЗЧ. Вводяться так само, як періоди служби. Якщо таких періодів немає, вкладку можна не чіпати.",
  },
  {
    title: "Заберіть результат",
    text: "Підсумок вислуги — внизу вкладки «2. Вислуга». Кнопки «Word» і «Excel» над передпереглядом вивантажують готовий витяг.",
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
