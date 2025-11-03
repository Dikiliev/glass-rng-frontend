import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

interface AnimatedGenerationProps {
  onComplete: (result: number) => void;
}

type Step = 
  | "idle"
  | "fetching"
  | "acquired"
  | "concatenating"
  | "converting"
  | "gathering"
  | "applying"
  | "calculating"
  | "result";

const AnimatedGeneration = ({ onComplete }: AnimatedGenerationProps) => {
  const [step, setStep] = useState<Step>("idle");
  const [result, setResult] = useState<number | null>(null);
  const [blocks, setBlocks] = useState<string[]>([]);

  useEffect(() => {
    const runAnimation = async () => {
      // Fetching blocks
      setStep("fetching");
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Blocks acquired
      const mockBlocks = [
        "5hVfGj...wX7d",
        "8kLmPq...nB4t",
        "2xRtYu...cV9p",
        "6wQzAs...mH3f",
      ];
      setBlocks(mockBlocks);
      setStep("acquired");
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Concatenating
      setStep("concatenating");
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Converting
      setStep("converting");
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Gathering noise
      setStep("gathering");
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Applying noise
      setStep("applying");
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Calculating
      setStep("calculating");
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Result
      const finalResult = Math.floor(Math.random() * 10);
      setResult(finalResult);
      setStep("result");
      onComplete(finalResult);
      
      // Reset after showing result
      await new Promise(resolve => setTimeout(resolve, 3000));
      setStep("idle");
      setResult(null);
      setBlocks([]);
    };

    const interval = setInterval(runAnimation, 12000);
    runAnimation();

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center">
      {/* Fetching State */}
      {step === "fetching" && (
        <div className="animate-fade-in">
          <div className="flex gap-4 items-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <div className="text-xl text-muted-foreground">Fetching Solana Blocks...</div>
          </div>
        </div>
      )}

      {/* Blocks Acquired */}
      {step === "acquired" && (
        <div className="flex gap-4 animate-scale-in">
          {blocks.map((hash, index) => (
            <div
              key={index}
              className="w-24 h-24 bg-card border border-primary rounded-lg flex items-center justify-center animate-fly-in shadow-[0_0_20px_hsl(var(--glow-primary)/0.3)]"
              style={{
                animationDelay: `${index * 0.1}s`,
                ["--start-x" as any]: `${(index - 2) * 200}px`,
                ["--start-y" as any]: "-200px",
              }}
            >
              <div className="font-mono text-xs text-primary text-center break-all p-2">
                {hash}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Concatenating */}
      {step === "concatenating" && (
        <div className="animate-fade-in">
          <div className="font-mono text-lg text-accent">
            <span className="animate-merge" style={{ ["--offset" as any]: "-100px" }}>
              5hVfGj...wX7d
            </span>
            <span className="animate-merge" style={{ ["--offset" as any]: "-50px" }}>
              8kLmPq...nB4t
            </span>
            <span className="animate-merge" style={{ ["--offset" as any]: "50px" }}>
              2xRtYu...cV9p
            </span>
            <span className="animate-merge" style={{ ["--offset" as any]: "100px" }}>
              6wQzAs...mH3f
            </span>
          </div>
          <div className="text-xl text-muted-foreground mt-4 text-center">
            Concatenating Hashes...
          </div>
        </div>
      )}

      {/* Converting */}
      {step === "converting" && (
        <div className="animate-fade-in text-center">
          <div className="flex gap-1 justify-center mb-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={i}
                className="w-2 h-12 bg-secondary rounded animate-morph"
                style={{ animationDelay: `${i * 0.05}s` }}
              />
            ))}
          </div>
          <div className="text-xl text-muted-foreground">
            Base58 → Byte Conversion
          </div>
        </div>
      )}

      {/* Gathering Noise */}
      {step === "gathering" && (
        <div className="relative animate-fade-in">
          <div className="absolute inset-0 flex items-center justify-center">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-accent rounded-full animate-float"
                style={{
                  left: `${Math.random() * 300 - 150}px`,
                  top: `${Math.random() * 300 - 150}px`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>
          <div className="text-xl text-muted-foreground">
            Gathering Environmental Noise...
          </div>
        </div>
      )}

      {/* Applying Noise */}
      {step === "applying" && (
        <div className="animate-fade-in text-center">
          <div className="relative w-64 h-64 mx-auto mb-4">
            <div className="absolute inset-0 bg-secondary/20 rounded-lg animate-pulse-glow" />
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 bg-primary rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `pulse-glow 0.5s ease-in-out ${i * 0.1}s`,
                }}
              />
            ))}
          </div>
          <div className="text-xl text-muted-foreground">
            Applying Noise to Data...
          </div>
        </div>
      )}

      {/* Calculating */}
      {step === "calculating" && (
        <div className="animate-fade-in">
          <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center animate-collapse">
            <div className="w-24 h-24 rounded-full bg-primary/40 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-primary/60 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-primary animate-pulse-glow" />
              </div>
            </div>
          </div>
          <div className="text-xl text-muted-foreground mt-4 text-center">
            Calculating Final Result...
          </div>
        </div>
      )}

      {/* Result */}
      {step === "result" && result !== null && (
        <div className="animate-expand-result">
          <div className="text-[200px] font-bold text-primary font-mono shadow-[0_0_60px_hsl(var(--glow-primary)/0.6)]">
            {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimatedGeneration;
