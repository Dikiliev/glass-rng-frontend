// src/pages/LiveDraw/components/RangePanel.tsx
import { useState, useEffect } from "react";
import { sampleRangeBySeed } from "../../../lib/api";

export function RangePanel({ seedHex, drawId }: { seedHex: string | null; drawId: string }) {
  const [res, setRes] = useState<null | any>(null);
  const [loading, setLoading] = useState(false);
  // no explicit error UI here; rely on details panel/logs

  useEffect(() => {
    if (!seedHex) {
      setRes(null);
      return;
    }

    const generate = async () => {
      setLoading(true);
      
      try {
        const data = await sampleRangeBySeed({
          seed_hex: seedHex,
          n1: "0",
          n2: "9",
          label: "RANDOM/v1",
          draw_id: drawId,
        });
        setRes(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    generate();
  }, [seedHex, drawId]);

  return (
    <div className="w-full py-12 md:py-16">
      {loading && (
        <div className="flex items-center justify-center">
          <div
            className="text-[96px] md:text-[160px] font-bold font-mono text-muted-foreground/40 animate-pulse"
            style={{ animation: "gentlePulse 2s ease-in-out infinite" }}
          >
            ...
          </div>
        </div>
      )}

      {res && !loading && (
        <div className="flex items-center justify-center">
          <div
            className="text-[96px] md:text-[160px] font-bold font-mono"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 50%, hsl(var(--accent)) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "fadeInScale 0.6s cubic-bezier(0.4, 0, 0.2, 1), glow-pulse 3s ease-in-out infinite",
              textShadow: "0 0 40px hsl(var(--glow-primary) / 0.5)",
              filter: "drop-shadow(0 0 20px hsl(var(--glow-primary) / 0.6))",
            }}
          >
            {res.value}
          </div>
        </div>
      )}
    </div>
  );
}
