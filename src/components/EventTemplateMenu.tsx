import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { EVENT_TEMPLATES } from "@/lib/eventTemplates";

// Меню заготовок для запису про контракт чи мобілізацію.
// Текст підставляється з датою цієї ж події і далі вільно редагується.
export const EventTemplateMenu = ({
  date,
  onPick,
}: {
  date: string;
  onPick: (text: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <div ref={wrapperRef} className="relative">
      <Button
        variant="outline"
        size="sm"
        className="h-10"
        onClick={() => setOpen((v) => !v)}
      >
        Шаблон
        <ChevronDown className="ml-1 h-3.5 w-3.5" />
      </Button>
      {open && (
        <div className="absolute left-0 z-50 mt-1 w-80 rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
          {EVENT_TEMPLATES.map((template) => (
            <button
              key={template.label}
              type="button"
              className="block w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground"
              onClick={() => {
                onPick(template.build(date));
                setOpen(false);
              }}
            >
              {template.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
