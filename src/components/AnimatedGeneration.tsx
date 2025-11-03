import { useMemo } from "react";
import { Loader2 } from "lucide-react";

interface AnimatedGenerationProps {
  step: "idle" | "fetching" | "acquired" | "concatenating" | "converting" | "gathering" | "applying" | "calculating" | "result";
  blocks?: any[];
}

const AnimatedGeneration = ({ step, blocks = [] }: AnimatedGenerationProps) => {
  // Форматируем блоки для отображения
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
        <div className="animate-fade-in">
          <div className="flex gap-4 items-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <div className="text-xl text-muted-foreground">Поиск блоков...</div>
          </div>
        </div>
      )}

      {/* Blocks Acquired */}
      {step === "acquired" && displayBlocks.length > 0 && (
        <div className="flex gap-4 animate-scale-in">
          {displayBlocks.map((hash, index) => (
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
            {displayBlocks.map((hash, index) => (
              <span
                key={index}
                className="animate-merge inline-block"
                style={{
                  ["--offset" as any]: `${(index - Math.floor(displayBlocks.length / 2)) * 100}px`,
                  marginRight: "0.5rem"
                }}
              >
                {hash}
              </span>
            ))}
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
        <div className="relative animate-fade-in w-full h-full">
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
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
          <div className="relative text-xl text-muted-foreground text-center">
            Сбор шума сервера...
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
                  animation: `pulse-glow 0.5s ease-in-out ${i * 0.1}s infinite`,
                }}
              />
            ))}
          </div>
          <div className="text-xl text-muted-foreground">
            Сбор шума завершен...
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
            Наложение шума на блок, расчет...
          </div>
        </div>
      )}

      {/* Result (без показа u64 числа — только визуальная финализация) */}
      {step === "result" && (
        <div className="animate-expand-result text-center">
          <div
            className="text-3xl font-semibold text-primary"
            style={{ textShadow: "0 0 30px hsl(var(--glow-primary) / 0.5)" }}
          >
            Результат готов
          </div>
          <div className="mt-3 text-muted-foreground">Отображение числа...</div>
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
