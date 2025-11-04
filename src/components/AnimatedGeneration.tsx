import { useMemo } from "react";
import { Loader2 } from "lucide-react";
import BlocksAcquired from "./animations/BlocksAcquired";

interface AnimatedGenerationProps {
  step: "idle" | "fetching" | "acquired" | "concatenating" | "converting" | "gathering" | "applying" | "calculating" | "result";
  blocks?: any[];
}

const AnimatedGeneration = ({ step, blocks = [] }: AnimatedGenerationProps) => {
  // Format blocks for display
  const displayBlocks = useMemo(() => {
    return blocks.map((block: any) => {
      const hash = block?.blockhash || block?.hash || block || "";
      if (typeof hash === "string" && hash.length > 12) {
        return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
      }
      return hash;
    });
  }, [blocks]);

  return (
    <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
      {/* Fetching State */}
      {step === "fetching" && (
        <div className="animate-fade-in relative w-full">
          <div className="flex gap-4 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <div className="text-xl text-muted-foreground">Fetching Solana blocks...</div>
          </div>
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[2px] w-[60%] -translate-x-1/2 -translate-y-1/2 overflow-hidden">
            <div className="h-[2px] w-1/3 bg-primary/70 blur-[1px] rounded-full animate-spark-travel" />
          </div>
        </div>
      )}

      {/* Blocks Acquired */}
      {step === "acquired" && displayBlocks.length > 0 && (
        <BlocksAcquired hashes={displayBlocks} />
      )}

      {/* Concatenating */}
      {step === "concatenating" && (
        <div className="animate-fade-in text-center">
          <div className="font-mono text-lg">
            {displayBlocks.map((hash, index) => (
              <span
                key={index}
                className="inline-block animate-flow-together text-foreground"
                style={{
                  // @ts-ignore
                  '--offset-x': `${(index - Math.floor(displayBlocks.length / 2)) * 100}px`,
                  marginRight: '0.25rem',
                  animationDelay: `${index * 0.15}s`,
                }}
              >
                {hash}
                {index < displayBlocks.length - 1 && (
                  <span className="text-foreground/40 mx-1">+</span>
                )}
              </span>
            ))}
          </div>
          <div className="text-xl text-muted-foreground mt-4 text-center">
            Concatenating hashes...
          </div>
        </div>
      )}

      {/* Converting */}
      {step === "converting" && (
        <div className="animate-fade-in text-center">
          <div className="flex flex-wrap gap-2 max-w-2xl justify-center mx-auto mb-2">
            {"5hVfwX7d8kLmpQ2x3nTyzR9w7vBnjK4m".split("").map((ch, i) => (
              <span
                key={i}
                className="font-mono text-lg animate-char-flip"
                style={{ animationDelay: `${i * 0.05}s`, color: 'hsl(var(--accent-animation))' }}
              >
                {ch}
              </span>
            ))}
          </div>
          <div className="text-xl text-muted-foreground">Base58 → Byte Conversion</div>
        </div>
      )}

      {/* Gathering Noise */}
      {step === "gathering" && (
        <div className="relative animate-fade-in w-full h-full">
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-foreground animate-particle-chaos"
                style={{
                  // @ts-ignore
                  '--particle-x': `${(Math.random() - 0.5) * 400}px`,
                  '--particle-y': `${(Math.random() - 0.5) * 400}px`,
                  '--particle-rotate': `${Math.random() * 360}deg`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
          </div>
          <div className="relative text-xl text-muted-foreground text-center">Gathering server noise...</div>
        </div>
      )}

      {/* Applying Noise */}
      {step === "applying" && (
        <div className="animate-fade-in text-center">
          <div className="relative w-full h-48 mx-auto mb-2 flex items-center justify-center">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-foreground animate-glitch"
                style={{
                  left: `${50 + (Math.random() - 0.5) * 40}%`,
                  top: `${50 + (Math.random() - 0.5) * 40}%`,
                  animationDelay: `${Math.random() * 0.4}s`,
                }}
              />
            ))}
            <div className="text-3xl font-mono text-foreground/90 animate-glitch">⚡</div>
          </div>
          <div className="text-xl text-muted-foreground">Server noise collected...</div>
        </div>
      )}

      {/* Calculating */}
      {step === "calculating" && (
        <div className="animate-fade-in">
          <div className="relative w-40 h-40 mx-auto">
            <div className="absolute inset-0 rounded-full border border-primary/40" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="absolute left-1/2 top-1/2 w-[6px] h-[6px] bg-primary rounded-full"
                style={{
                  ["--orbit-r" as any]: `${40 + i * 16}px`,
                  transformOrigin: "0 0",
                  animation: `orbit ${1.6 + i * 0.2}s linear ${i * 0.1}s infinite`,
                }}
              />
            ))}
          </div>
          <div className="text-xl text-muted-foreground mt-4 text-center">
            Mixing noise with blocks, calculating...
          </div>
        </div>
      )}

      {/* Result (without showing u64 — just visual finalization) */}
      {step === "result" && (
        <div className="text-center">
          <div className="inline-block animate-explode">
            <div className="text-3xl font-semibold text-primary">Result is ready</div>
          </div>
          <div className="mt-3 text-muted-foreground">Displaying number...</div>
        </div>
      )}

      {/* Idle State */}
      {step === "idle" && (
        <div className="text-muted-foreground text-xl">
          Ready to generate...
        </div>
      )}
    </div>
  );
};

export default AnimatedGeneration;
