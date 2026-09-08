import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, HelpCircle, Moon, RotateCcw, Sun, Upload } from "lucide-react";
import { HowTo } from "@/components/HowTo";
import { PersonForm } from "@/components/PersonForm";
import { ServiceCalculatorTab } from "@/components/ServiceCalculatorTab";
import { ServiceRecordTab } from "@/components/ServiceRecordTab";
import {
  AppState,
  EMPTY_STATE,
  clearState,
  downloadState,
  isHowToSeen,
  loadState,
  markHowToSeen,
  parseImported,
  saveState,
} from "@/lib/storage";
import { Theme, applyTheme, initialTheme } from "@/lib/theme";

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [importError, setImportError] = useState<string | null>(null);
  const [howToOpen, setHowToOpen] = useState(() => !isHowToSeen());
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const handleImport = async (file: File) => {
    setImportError(null);
    try {
      setState(parseImported(await file.text()));
    } catch {
      setImportError(
        "Не вдалося прочитати файл — потрібен файл, збережений цим самим застосунком"
      );
    }
  };

  const closeHowTo = () => {
    setHowToOpen(false);
    markHowToSeen();
  };

  const handleReset = () => {
    if (!confirm("Стерти всі введені дані й почати спочатку?")) return;
    clearState();
    setState(EMPTY_STATE);
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-3 p-3 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold">Вислуга 360</h1>
          <p className="text-xs text-muted-foreground">
            Послужний список і калькулятор вислуги років
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            title="Показати покрокову інструкцію"
            onClick={() => setHowToOpen(true)}
          >
            <HelpCircle className="mr-1 h-3.5 w-3.5" />
            Як користуватись
          </Button>
          <Button
            variant="outline"
            size="sm"
            title="Зберегти всі введені дані у файл, щоб перенести на інший комп'ютер"
            onClick={() => downloadState(state)}
          >
            <Download className="mr-1 h-3.5 w-3.5" />
            Зберегти у файл
          </Button>
          <Button
            variant="outline"
            size="sm"
            title="Відкрити раніше збережений файл із даними"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-1 h-3.5 w-3.5" />
            Відкрити файл
          </Button>
          <Button
            variant="outline"
            size="sm"
            title="Стерти все введене й почати з чистого аркуша"
            onClick={handleReset}
          >
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            Почати спочатку
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            aria-label={theme === "dark" ? "Світла тема" : "Темна тема"}
            title={theme === "dark" ? "Світла тема" : "Темна тема"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImport(file);
              e.target.value = "";
            }}
          />
        </div>
      </header>

      {importError && <p className="text-sm text-destructive">{importError}</p>}

      <HowTo open={howToOpen} onClose={closeHowTo} />

      <PersonForm
        person={state.person}
        onChange={(person) => setState((s) => ({ ...s, person }))}
      />

      <Tabs defaultValue="record">
        <TabsList>
          <TabsTrigger value="record">1. Послужний список</TabsTrigger>
          <TabsTrigger value="calculator">2. Вислуга</TabsTrigger>
        </TabsList>
        <TabsContent value="record">
          <ServiceRecordTab
            person={state.person}
            records={state.records}
            onChange={(records) => setState((s) => ({ ...s, records }))}
          />
        </TabsContent>
        <TabsContent value="calculator">
          <ServiceCalculatorTab
            records={state.records}
            extras={state.extras}
            onChangeExtras={(extras) => setState((s) => ({ ...s, extras }))}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
