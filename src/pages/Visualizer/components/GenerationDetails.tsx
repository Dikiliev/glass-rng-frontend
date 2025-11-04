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
    <Accordion type="single" collapsible className="bg-transparent">
      <AccordionItem value={title} className="bg-transparent border-0 backdrop-blur-0">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center gap-2">
              {done && <CheckCircle className="w-4 h-4 text-green-500" />}
              <span className="text-sm font-medium">{title}</span>
            </div>
            {summaryHint && <span className="text-xs text-muted-foreground">{summaryHint}</span>}
          </div>
        </AccordionTrigger>
        <AccordionContent className="bg-transparent backdrop-blur-0">{children}</AccordionContent>
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
        <AccordionTrigger className="text-lg font-semibold">Generation details</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-6">
            {/* Draw ID */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-muted-foreground">Draw ID</div>
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
                  Blocks: {blocksCount}
                </div>
                {inputs.includes("PUB") && (
                  <div className="text-xs bg-muted px-2 py-1 rounded text-foreground">
                    Source: blocks (PUB)
                  </div>
                )}
                {inputs.includes("LOC") && (
                  <div className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                    Server noise (LOC)
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

            {/* Status bar */}
            <div className="space-y-2">
              <StatusBar
                status={status}
                inputs={inputs}
                statusNote={statusNote}
                collectOpen={collectOpen}
                collectRemainMs={collectRemainMs}
              />
            </div>

            {/* Result (technical) */}
            {seedHex && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium text-muted-foreground">Result (seed)</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigator.clipboard.writeText(seedHex)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <ResultPanel seedHex={seedHex} result={typeof result === 'number' ? String(result) : result} />
                </div>
              </>
            )}

            {/* Source & beacon */}
            <Separator />
            <SectionAccordion
              title="Source & beacon"
              done={srcDone}
              summaryHint={srcDone ? "Blocks found" : "Waiting for blocks"}
            >
              <BlocksPanel blocks={blocksList} beaconHex={beaconHex} />
            </SectionAccordion>

            {/* Noise impact */}
            {compare && (
              <>
                <Separator />
                <SectionAccordion
                  title="Noise impact (PUB vs PUB+LOC)"
                  done={noiseDone && mixDone}
                  summaryHint="Comparison ready"
                >
                  <ComparePanel pub={compare.pub} pub_loc={compare.pub_loc} />
                </SectionAccordion>
              </>
            )}

            {/* Trace */}
            {trace && (
              <>
                <Separator />
                <SectionAccordion
                  title="How the number is derived (trace)"
                  done={mixDone}
                  summaryHint="Seed, ChaCha and u64 recorded"
                >
                  <TracePanel trace={trace} />
                </SectionAccordion>
              </>
            )}

            {/* Server noise */}
            <Separator />
            <SectionAccordion
              title="Server noise (details)"
              done={noiseDone}
              summaryHint={noiseDone ? "Noise collected" : "Collecting noise"}
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

            {/* Log */}
            <Separator />
            <SectionAccordion title="Live log" done={resultDone} summaryHint="Technical events">
              <LiveLog events={events} />
            </SectionAccordion>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

