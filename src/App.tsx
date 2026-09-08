import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, RotateCcw, Upload } from "lucide-react";
import { PersonForm } from "@/components/PersonForm";
import { ServiceCalculatorTab } from "@/components/ServiceCalculatorTab";
import { ServiceRecordTab } from "@/components/ServiceRecordTab";
import {
  AppState,
  EMPTY_STATE,
  clearState,
  downloadState,
  loadState,
  parseImported,
  saveState,
} from "@/lib/storage";

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [importError, setImportError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const handleImport = async (file: File) => {
    setImportError(null);
    try {
      setState(parseImported(await file.text()));
    } catch {
      setImportError("Не вдалося прочитати файл — очікується JSON цього ж застосунку");
    }
  };

  const handleReset = () => {
    if (!confirm("Очистити всі введені дані?")) return;
    clearState();
    setState(EMPTY_STATE);
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-3 p-3 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-lg font-semibold">
            Послужний список і калькулятор вислуги років
          </h1>
          <p className="text-xs text-muted-foreground">
            Дані зберігаються лише у вашому браузері й нікуди не надсилаються.
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => downloadState(state)}
          >
            <Download className="mr-1 h-3.5 w-3.5" />
            Зберегти JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="mr-1 h-3.5 w-3.5" />
            Завантажити JSON
          </Button>
          <Button variant="outline" size="sm" onClick={handleReset}>
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            Очистити
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

      <PersonForm
        person={state.person}
        onChange={(person) => setState((s) => ({ ...s, person }))}
      />

      <Tabs defaultValue="record">
        <TabsList>
          <TabsTrigger value="record">Послужний список</TabsTrigger>
          <TabsTrigger value="calculator">Вислуга</TabsTrigger>
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
