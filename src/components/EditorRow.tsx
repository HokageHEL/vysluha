import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import { formatDays360, periodDuration360 } from "@/lib/service-calc";
import { cn } from "@/lib/utils";

// Спільна оболонка рядка для всіх списків застосунку: періодів послужного
// списку, подій служби та особливих періодів вислуги.
export const EditorRow = ({
  children,
  onRemove,
  removeLabel,
  dashed,
}: {
  children: ReactNode;
  onRemove: () => void;
  removeLabel: string;
  dashed?: boolean;
}) => (
  <div
    className={cn(
      "relative space-y-2 rounded-md border p-2 pr-10",
      dashed && "border-dashed bg-muted/30",
    )}
  >
    {children}
    <Button
      variant="ghost"
      size="icon"
      aria-label={removeLabel}
      title={removeLabel}
      className="absolute right-1 top-1 h-7 w-7 text-destructive"
      onClick={onRemove}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);

// Початок і кінець періоду з підказкою про тривалість.
// Порожній кінець означає «по теперішній час».
export const DateRange = ({
  startDate,
  endDate,
  onChange,
}: {
  startDate: string;
  endDate: string;
  onChange: (patch: { startDate?: string; endDate?: string }) => void;
}) => {
  const duration = periodDuration360(startDate, endDate);
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        type="date"
        className="w-[150px]"
        value={startDate}
        onChange={(e) => onChange({ startDate: e.target.value })}
      />
      <span className="text-muted-foreground">–</span>
      <Input
        type="date"
        className="w-[150px]"
        value={endDate}
        onChange={(e) => onChange({ endDate: e.target.value })}
      />
      <span className="text-xs text-muted-foreground">
        {!endDate && "по т.ч."}
        {duration !== null && ` ${formatDays360(duration)}`}
      </span>
    </div>
  );
};
