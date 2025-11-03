import { CheckCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { StatusBar } from "../../LiveDraw/components/StatusBar";
import { ResultPanel } from "../../LiveDraw/components/ResultPanel";
import { BlocksPanel } from "../../LiveDraw/components/BlocksPanel";
import { TracePanel } from "../../LiveDraw/components/TracePanel";
import { ServerEntropyPanel } from "../../LiveDraw/components/ServerEntropyPanel";
import { ComparePanel } from "../../LiveDraw/components/ComparePanel";
import { LiveLog } from "../../LiveDraw/components/LiveLog";

interface GenerationDetailsProps {
  activeDrawId: string | null;
  blocksCount: number;
  status: "waiting" | "committed" | "finalized" | "mixing" | "done";
  statusNote: string | null;
  inputs: string[];
  collectOpen: boolean;
  collectRemainMs: number | null;
  seedHex: string | null;
  result: string | number | null;
  blocksList: any[];
  beaconHex: string | null;
  compare: any;
  trace: any;
  locBytes: number;
  locPackets: number;
  locRoot: string | null;
  locSummary: any;
  events: any[];
  resultDone: boolean;
  srcDone: boolean;
  noiseDone: boolean;
  mixDone: boolean;
}

function SectionAccordion({
  title,
  children,
  done,
  summaryHint,
}: {
  title: string;
  children: React.ReactNode;
  done?: boolean;
  summaryHint?: string;
}) {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value={title}>
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center gap-2">
              {done && <CheckCircle className="w-4 h-4 text-green-500" />}
              <span className="text-sm font-medium">{title}</span>
            </div>
            {summaryHint && <span className="text-xs text-muted-foreground">{summaryHint}</span>}
          </div>
        </AccordionTrigger>
        <AccordionContent>{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function GenerationDetails({
  activeDrawId,
  blocksCount,
  status,
  statusNote,
  inputs,
  collectOpen,
  collectRemainMs,
  seedHex,
  result,
  blocksList,
  beaconHex,
  compare,
  trace,
  locBytes,
  locPackets,
  locRoot,
  locSummary,
  events,
  resultDone,
  srcDone,
  noiseDone,
  mixDone,
}: GenerationDetailsProps) {
  return (
    <Accordion type="single" collapsible className="w-full mb-8">
      <AccordionItem value="details">
        <AccordionTrigger className="text-lg font-semibold">Детали генерации</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-6">
            {/* ID генерации */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">ID генерации</div>
              <div className="flex items-center gap-2">
                <code className="text-sm font-mono bg-muted px-2 py-1 rounded text-foreground">
                  {activeDrawId}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigator.clipboard.writeText(activeDrawId || "")}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                <div className="text-xs bg-muted px-2 py-1 rounded text-foreground">
                  Блоков: {blocksCount}
                </div>
                {inputs.includes("PUB") && (
                  <div className="text-xs bg-muted px-2 py-1 rounded text-foreground">
                    Источник: блоки (PUB)
                  </div>
                )}
                {inputs.includes("LOC") && (
                  <div className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                    Шум сервера (LOC)
                  </div>
                )}
                {locBytes > 0 && (
                  <div className="text-xs bg-muted px-2 py-1 rounded text-foreground">
                    LOC bytes: {locBytes}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Статус бар */}
            <div className="space-y-2">
              <StatusBar
                status={status}
                inputs={inputs}
                statusNote={statusNote}
                collectOpen={collectOpen}
                collectRemainMs={collectRemainMs}
              />
            </div>

            {/* Результат (технический) */}
            {seedHex && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-muted-foreground">Результат (seed)</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(seedHex)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <ResultPanel seedHex={seedHex} result={result} />
                </div>
              </>
            )}

            {/* Источник и beacon */}
            <Separator />
            <SectionAccordion
              title="Источник и beacon"
              done={srcDone}
              summaryHint={srcDone ? "Блоки найдены" : "Ожидание блоков"}
            >
              <BlocksPanel blocks={blocksList} beaconHex={beaconHex} />
            </SectionAccordion>

            {/* Влияние шума */}
            {compare && (
              <>
                <Separator />
                <SectionAccordion
                  title="Влияние шума (PUB vs PUB+LOC)"
                  done={noiseDone && mixDone}
                  summaryHint="Сравнение готово"
                >
                  <ComparePanel pub={compare.pub} pub_loc={compare.pub_loc} />
                </SectionAccordion>
              </>
            )}

            {/* Трассировка */}
            {trace && (
              <>
                <Separator />
                <SectionAccordion
                  title="Как получено число (трассировка)"
                  done={mixDone}
                  summaryHint="Сид, ChaCha и u64 зафиксированы"
                >
                  <TracePanel trace={trace} />
                </SectionAccordion>
              </>
            )}

            {/* Серверный шум */}
            <Separator />
            <SectionAccordion
              title="Серверный шум (детали)"
              done={noiseDone}
              summaryHint={noiseDone ? "Шум собран" : "Сбор шума"}
            >
              <ServerEntropyPanel
                locBytes={locBytes}
                locPackets={locPackets}
                locRoot={locRoot}
                summary={
                  locSummary
                    ? {
                        urandomBytes: locSummary.urandomBytes,
                        jitterBatches: locSummary.jitterBatches,
                        jitterBytes: locSummary.jitterBytes,
                        jitterSamplesTotal: locSummary.jitterSamplesTotal,
                      }
                    : null
                }
              />
            </SectionAccordion>

            {/* Лог */}
            <Separator />
            <SectionAccordion title="Live log" done={resultDone} summaryHint="Технические события">
              <LiveLog events={events} />
            </SectionAccordion>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

