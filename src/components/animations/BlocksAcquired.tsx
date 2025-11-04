import React from "react";

type BlocksAcquiredProps = {
  hashes: string[];
};

// Visual style inspired by visual-solana-spark BlockCubes:
// - Strong borders, monochrome, fly-in from offscreen corners
// - Subtle glow pulse on arrival, readable hash inside
export function BlocksAcquired({ hashes }: BlocksAcquiredProps) {
  // Pick 4 most recent if many
  const items = hashes.slice(0, 4);

  return (
    <div className="flex gap-8 items-center justify-center relative">
      {items.map((hash, idx) => {
        const startX = idx < 2 ? -800 : 800;
        const startY = idx % 2 === 0 ? -300 : 300;
        return (
          <div
            key={`${hash}-${idx}`}
            className="relative animate-fly-in"
            style={{
              // @ts-ignore
              '--start-x': `${startX}px`,
              // @ts-ignore
              '--start-y': `${startY}px`,
              animationDelay: `${idx * 0.15}s`,
            }}
          >
            <div className="w-24 h-24 border-2 border-foreground/90 flex items-center justify-center animate-pulse-glow rounded-md">
              <span className="text-xs font-mono text-foreground/80 px-2 text-center break-all">
                {hash}
              </span>
            </div>
          </div>
        );
      })}

      {/* scanline overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute left-0 right-0 top-0 h-6 bg-foreground/5 animate-scanline" />
      </div>
    </div>
  );
}

export default BlocksAcquired;


