import { useEffect, useState } from "react";
import { BlockCubes } from "./animation/BlockCubes";
import { HashConcatenation } from "./animation/HashConcatenation";
import { ByteTransformation } from "./animation/ByteTransformation";
import { NoiseParticles } from "./animation/NoiseParticles";
import { FinalResult } from "./animation/FinalResult";

type AnimationStage = 
  | "fetching"
  | "acquired"
  | "concatenating"
  | "converting"
  | "noise"
  | "applying"
  | "calculating"
  | "result";

export const GenerationAnimation = () => {
  const [stage, setStage] = useState<AnimationStage>("fetching");
  const [finalDigit, setFinalDigit] = useState<number>(0);

  useEffect(() => {
    const runSequence = () => {
      setStage("fetching");
      
      setTimeout(() => setStage("acquired"), 1200);
      setTimeout(() => setStage("concatenating"), 2500);
      setTimeout(() => setStage("converting"), 3800);
      setTimeout(() => setStage("noise"), 4800);
      setTimeout(() => setStage("applying"), 5800);
      setTimeout(() => setStage("calculating"), 6800);
      setTimeout(() => {
        setFinalDigit(Math.floor(Math.random() * 10));
        setStage("result");
      }, 7600);
    };

    runSequence();
    const interval = setInterval(runSequence, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-4xl h-[400px] flex items-center justify-center">
      {/* Stage Indicator */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 text-sm text-white/60 font-mono tracking-wide">
        {stage === "fetching" && "Fetching Solana Blocks..."}
        {stage === "acquired" && "Blocks Acquired"}
        {stage === "concatenating" && "Concatenating Hashes"}
        {stage === "converting" && "Base58 → Byte Conversion"}
        {stage === "noise" && "Gathering Environmental Noise"}
        {stage === "applying" && "Applying Noise"}
        {stage === "calculating" && "Calculating Final Result"}
        {stage === "result" && "Result"}
      </div>

      {/* Animation Components */}
      <div className="relative w-full h-full flex items-center justify-center">
        {(stage === "fetching" || stage === "acquired") && <BlockCubes stage={stage} />}
        {stage === "concatenating" && <HashConcatenation />}
        {stage === "converting" && <ByteTransformation />}
        {stage === "noise" && <NoiseParticles />}
        {stage === "applying" && <NoiseParticles applying />}
        {stage === "calculating" && (
          <div className="w-4 h-4 rounded-full bg-cyan-400 glow-cyan-strong animate-pulse-glow" />
        )}
        {stage === "result" && <FinalResult digit={finalDigit} />}
      </div>
    </div>
  );
};
