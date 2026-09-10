import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Github,
  HelpCircle,
  Moon,
  RotateCcw,
  ShieldCheck,
  Sun,
  X,
} from "lucide-react";
import { HowTo } from "@/components/HowTo";
import { Logo } from "@/components/Logo";
import { PersonForm } from "@/components/PersonForm";
import { SignatureForm } from "@/components/SignatureForm";
import { ServiceCalculatorTab } from "@/components/ServiceCalculatorTab";
import { ServiceRecordTab } from "@/components/ServiceRecordTab";
import { SimpleCalculator } from "@/components/SimpleCalculator";
import { SalaryCalculatorTab } from "@/components/SalaryCalculatorTab";
import { computeServiceTotals, today } from "@/lib/service-calc";

import {
  AppState,
  EMPTY_STATE,
  clearState,
  dismissPrivacyNotice,
  isPrivacyNoticeDismissed,
  isHowToSeen,
  loadState,
  markHowToSeen,
  saveState,
} from "@/lib/storage";
import { Theme, applyTheme, initialTheme } from "@/lib/theme";

export default function App() {
  const [state, setState] = useState<AppState>(loadState);
  const [theme, setTheme] = useState<Theme>(initialTheme);
  const [howToOpen, setHowToOpen] = useState(() => !isHowToSeen());
  const [privacyNoticeOpen, setPrivacyNoticeOpen] = useState(
    () => !isPrivacyNoticeDismissed(),
  );

  useEffect(() => {
    saveState(state);
  }, [state]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const closeHowTo = () => {
    setHowToOpen(false);
    markHowToSeen();
  };

  const handleReset = () => {
    if (!confirm("Стерти всі введені дані й почати спочатку?")) return;
    clearState();
    setState(EMPTY_STATE);
  };

  const isPro = state.mode === "pro";
  const closePrivacyNotice = () => {
    setPrivacyNoticeOpen(false);
    dismissPrivacyNotice();
  };

  const asOf = state.calculationDate || today();
  const proTotals = computeServiceTotals(state.records, state.extras, asOf);
  const standardTotals = computeServiceTotals([], state.simplePeriods, asOf);
  const proYears = proTotals.calendarTotal / 360;
  const standardYears = standardTotals.calendarTotal / 360;

  return (
    <div className="mx-auto max-w-[1600px] space-y-3 p-3 sm:p-6">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <Logo className="h-8 w-8 shrink-0" />
          <div>
            <h1 className="text-lg font-semibold leading-tight">Вислуга 360</h1>
            <p className="text-xs text-muted-foreground">
              Послужний список і калькулятор вислуги років
            </p>
          </div>
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
            title="Стерти все введене й почати з чистого аркуша"
            onClick={handleReset}
          >
            <RotateCcw className="mr-1 h-3.5 w-3.5" />
            Очистити
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
        </div>
      </header>

      <HowTo open={howToOpen} onClose={closeHowTo} />

      <div className="inline-flex rounded-md bg-muted p-1" role="group" aria-label="Режим роботи">
        <Button size="sm" variant={!isPro ? "secondary" : "ghost"} onClick={() => setState((s) => ({ ...s, mode: "standard" }))}>Звичайний</Button>
        <Button size="sm" variant={isPro ? "secondary" : "ghost"} onClick={() => setState((s) => ({ ...s, mode: "pro" }))}>Pro</Button>
      </div>

      {privacyNoticeOpen && <div className="flex items-start gap-2 rounded-md border border-primary/20 bg-primary/5 p-3 text-sm">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <p className="flex-1">
          <strong>Ваші дані залишаються у вас.</strong> Застосунок працює без бази данних: введена інформація обробляється та зберігається лише локально у Вашому браузері й не передається нам або третім сторонам. Якщо очистити дані браузера чи скористатися іншим пристроєм або браузером - записи будуть недоступні.
        </p>
        <Button variant="ghost" size="icon" className="-mr-1 -mt-1 h-7 w-7 shrink-0" onClick={closePrivacyNotice} aria-label="Закрити повідомлення про приватність" title="Закрити">
          <X className="h-4 w-4" />
        </Button>
      </div>}

      {isPro ? <>
      <PersonForm person={state.person} onChange={(person) => setState((s) => ({ ...s, person }))} />
      <Tabs defaultValue="record">
        <TabsList>
          <TabsTrigger value="record">1. Послужний список</TabsTrigger>
          <TabsTrigger value="calculator">2. Вислуга</TabsTrigger>
          <TabsTrigger value="salary">3. Грошове забезпечення</TabsTrigger>
        </TabsList>
        <TabsContent value="record" className="space-y-3">
          <ServiceRecordTab
            person={state.person}
            records={state.records}
            events={state.events}
            signature={state.signature}
            onChangeRecords={(records) => setState((s) => ({ ...s, records }))}
            onChangeEvents={(events) => setState((s) => ({ ...s, events }))}
          />
          <SignatureForm
            signature={state.signature}
            onChange={(signature) => setState((s) => ({ ...s, signature }))}
          />
        </TabsContent>
        <TabsContent value="calculator">
          <ServiceCalculatorTab
            records={state.records}
            extras={state.extras}
            calculationDate={state.calculationDate}
            onChangeCalculationDate={(calculationDate) => setState((s) => ({ ...s, calculationDate }))}
            onChangeExtras={(extras) => setState((s) => ({ ...s, extras }))}
          />
        </TabsContent>
        <TabsContent value="salary">
          <SalaryCalculatorTab
            salary={state.salary}
            onChangeSalary={(salary) => setState((s) => ({ ...s, salary }))}
            personRank={state.person.militaryRank}
            calculatedSeniorityYears={proYears}
          />
        </TabsContent>
      </Tabs>
      </> : (
      <Tabs defaultValue="calculator">
        <TabsList>
          <TabsTrigger value="calculator">1. Вислуга</TabsTrigger>
          <TabsTrigger value="salary">2. Грошове забезпечення</TabsTrigger>
        </TabsList>
        <TabsContent value="calculator">
          <SimpleCalculator
            periods={state.simplePeriods}
            calculationDate={state.calculationDate}
            onChangeCalculationDate={(calculationDate) => setState((s) => ({ ...s, calculationDate }))}
            onChangePeriods={(simplePeriods) => setState((s) => ({ ...s, simplePeriods }))}
          />
        </TabsContent>
        <TabsContent value="salary">
          <SalaryCalculatorTab
            salary={state.salary}
            onChangeSalary={(salary) => setState((s) => ({ ...s, salary }))}
            calculatedSeniorityYears={standardYears}
          />
        </TabsContent>
      </Tabs>
      )}


      <footer className="border-t pt-3 text-center text-xs text-muted-foreground">
        Дякую, що користуєтесь. Посилання на проєкт —{" "}
        <a
          href="https://github.com/HokageHEL/vysluha"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-foreground"
        >
          <Github className="h-3 w-3" />
          GitHub
        </a>
        , там же приймаю пропозиції й ідеї.
      </footer>
    </div>
  );
}
