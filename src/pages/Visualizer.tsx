import { useEffect, useMemo, useState } from "react";
import { FileText } from "lucide-react";
import FloatingDigits from "@/components/FloatingDigits";
import AnimatedGeneration from "@/components/AnimatedGeneration";
import GenerationLog from "@/components/GenerationLog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDrawSSE } from "./LiveDraw/hooks/useDrawSSE";
import { RangePanel } from "./LiveDraw/components/RangePanel";
import { GenerationDetails } from "./Visualizer/components/GenerationDetails";
import { useDrawInitialization } from "./Visualizer/hooks/useDrawInitialization";
import { useAnimationSequence } from "./Visualizer/hooks/useAnimationSequence";

const Visualizer = () => {
  const { activeDrawId, blocksCount } = useDrawInitialization();
  const [isLogOpen, setIsLogOpen] = useState(false);

  const {
    events,
    statusNote,
    inputs,
    blocksList,
    beaconHex,
    seedHex,
    result,
    trace,
    locBytes,
    locPackets,
    locRoot,
    collectOpen,
    collectRemainMs,
    locSummary,
    compare,
  } = useDrawSSE(activeDrawId || "");

  const { displayStep } = useAnimationSequence({
    events,
    blocksList,
    result,
    activeDrawId,
  });

  // Показ финальной панели только после короткого показа шага "result"
  const [showFinalPanel, setShowFinalPanel] = useState(false);
  useEffect(() => {
    if (displayStep === "result" && seedHex) {
      const t = setTimeout(() => setShowFinalPanel(true), 1000);
      return () => clearTimeout(t);
    } else {
      setShowFinalPanel(false);
    }
  }, [displayStep, seedHex]);

  const status: "waiting" | "committed" | "finalized" | "mixing" | "done" = useMemo(() => {
    const types = events.map((e) => e.type);
    if (types.includes("result")) return "done";
    if (types.includes("mix.start")) return "mixing";
    if (types.includes("block.finalized_all")) return "finalized";
    if (types.some((t) => t.includes("commit"))) return "committed";
    return "waiting";
  }, [events]);

  const noiseClosed = events.some(
    (e) => e.type === "collect.close" || e.type === "collect.summary"
  );
  const mixed = events.some((e) => e.type === "mix.trace" || e.type === "result");
  const hasResult = events.some((e) => e.type === "result");
  const hasLOC = inputs.includes("LOC") || locBytes > 0 || !!locSummary;
  const srcDone = blocksList.length > 0;
  const noiseDone = hasLOC ? noiseClosed : true;
  const mixDone = mixed;
  const resultDone = hasResult;

  const numericResult = useMemo(() => {
    if (!result) return null;
    if (typeof result === "number") return result;
    const num = typeof result === "string" ? parseInt(result, 10) : null;
    return isNaN(num as number) ? null : num;
  }, [result]);

  const generationData = {
    result: numericResult,
    timestamp: new Date().toISOString(),
    blocks: blocksList,
    beaconHex,
    seedHex,
    trace,
    locSummary,
    events,
  };

  if (!activeDrawId) {
    return (
      <div className="min-h-screen pt-20 relative overflow-hidden">
        <FloatingDigits />
        <div className="container mx-auto px-6 py-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Честная генерация случайных чисел
            </h1>
            <p className="text-muted-foreground text-lg mb-8">Ожидание генерации...</p>
          </div>
        </div>
      </div>
    );
  }

  const shouldShowRangePanel = seedHex && status === "done" && showFinalPanel;

  return (
    <div className="min-h-screen pt-20 relative overflow-hidden">
      <FloatingDigits />

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Честная генерация случайных чисел
            </h1>
            <p className="text-muted-foreground text-lg">
              Каждый шаг процесса генерации в реальном времени
            </p>
          </div>

          <Card className="border-border shadow-2xl mb-8 bg-card/50 backdrop-blur">
            <CardContent className="p-8">
              {shouldShowRangePanel ? (
                <RangePanel seedHex={seedHex} drawId={activeDrawId} />
              ) : (
                <AnimatedGeneration step={displayStep} blocks={blocksList} />
              )}
            </CardContent>
          </Card>

          <GenerationDetails
            activeDrawId={activeDrawId}
            blocksCount={blocksCount}
            status={status}
            statusNote={statusNote}
            inputs={inputs}
            collectOpen={collectOpen}
            collectRemainMs={collectRemainMs}
            seedHex={seedHex}
            result={result}
            blocksList={blocksList}
            beaconHex={beaconHex}
            compare={compare}
            trace={trace}
            locBytes={locBytes}
            locPackets={locPackets}
            locRoot={locRoot}
            locSummary={locSummary}
            events={events}
            resultDone={resultDone}
            srcDone={srcDone}
            noiseDone={noiseDone}
            mixDone={mixDone}
          />

          <div className="flex justify-center">
            <Button
              onClick={() => setIsLogOpen(true)}
              variant="outline"
              className="gap-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300"
            >
              <FileText className="w-4 h-4" />
              Просмотр лога генерации
            </Button>
          </div>
        </div>
      </div>

      <GenerationLog
        isOpen={isLogOpen}
        onClose={() => setIsLogOpen(false)}
        data={generationData}
      />
    </div>
  );
};

export default Visualizer;
