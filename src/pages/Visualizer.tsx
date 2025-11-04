import { useEffect, useMemo, useState } from "react";
// import { FileText } from "lucide-react";
import FloatingDigits from "@/components/FloatingDigits";
import AnimatedGeneration from "@/components/AnimatedGeneration";
// import GenerationLog from "@/components/GenerationLog";
// import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDrawSSE } from "./LiveDraw/hooks/useDrawSSE";
import { RangePanel } from "./LiveDraw/components/RangePanel";
import { GenerationDetails } from "./Visualizer/components/GenerationDetails";
import { InlineLiveLog } from "./Visualizer/components/InlineLiveLog";
import { useDrawInitialization } from "./Visualizer/hooks/useDrawInitialization";
import { useAnimationSequence } from "./Visualizer/hooks/useAnimationSequence";

const Visualizer = () => {
  const { activeDrawId, blocksCount } = useDrawInitialization();
  // const [isLogOpen, setIsLogOpen] = useState(false);

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

  // Show final panel only after a short "result" step display
  const [showFinalPanel, setShowFinalPanel] = useState(false);
  useEffect(() => {
    if (displayStep === "result" && seedHex) {
      const t = setTimeout(() => setShowFinalPanel(true), 1000);
      return () => clearTimeout(t);
    } else {
      setShowFinalPanel(false);
    }
  }, [displayStep, seedHex]);

  // Reset final panel and details on new drawId
  useEffect(() => {
    setShowFinalPanel(false);
  }, [activeDrawId]);

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

  // const numericResult = useMemo(() => {
  //   if (!result) return null;
  //   if (typeof result === "number") return result;
  //   const num = typeof result === "string" ? parseInt(result, 10) : null;
  //   return isNaN(num as number) ? null : num;
  // }, [result]);

  // const generationData = {
  //   result: numericResult,
  //   timestamp: new Date().toISOString(),
  //   blocks: blocksList,
  //   beaconHex,
  //   seedHex,
  //   trace,
  //   locSummary,
  //   events,
  // };

  if (!activeDrawId) {
    return (
      <div className="min-h-screen pt-20 relative overflow-hidden">
        <FloatingDigits />
        <div className="container mx-auto px-6 py-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Most Random Number
            </h1>
            <p className="text-muted-foreground text-lg mb-8">Waiting for generation...</p>
          </div>
        </div>
      </div>
    );
  }

  const shouldShowRangePanel = seedHex && status === "done" && showFinalPanel;
  const shouldShowDetails = shouldShowRangePanel;

  return (
    <div className="min-h-screen pt-20 relative overflow-hidden">
      <FloatingDigits />

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Most Random Number
            </h1>
            <p className="text-muted-foreground text-lg">
            Generated using Solana blockchain + cryptographic noise
            </p>
          </div>

          <Card className="border-border shadow-2xl mb-4 bg-card/50 backdrop-blur">
            <CardContent className="p-8">
              {shouldShowRangePanel ? (
                <RangePanel seedHex={seedHex} drawId={activeDrawId} />
              ) : (
                <AnimatedGeneration step={displayStep} blocks={blocksList} />
              )}
            </CardContent>
          </Card>

          {/* Inline mini-log: show only before result */}
          {status !== "done" && (
            <InlineLiveLog events={events} visible={true} activeDrawId={activeDrawId} />
          )}

          {shouldShowDetails && (
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
          )}

          {/* Live Log button temporarily disabled */}
        </div>
      </div>

      {/* Live Log modal temporarily disabled */}
    </div>
  );
};

export default Visualizer;
