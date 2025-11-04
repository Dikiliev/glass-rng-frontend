interface BlockCubesProps {
  stage: "fetching" | "acquired";
}

const mockBlockHashes = [
  "5hVf...wX7d",
  "8kLm...pQ2x",
  "3nTy...zR9w",
  "7vBn...jK4m",
];

export const BlockCubes = ({ stage }: BlockCubesProps) => {
  return (
    <div className="flex gap-8 items-center justify-center">
      {mockBlockHashes.map((hash, idx) => {
        const startX = idx < 2 ? -800 : 800;
        const startY = (idx % 2 === 0 ? -300 : 300);
        
        return (
          <div
            key={idx}
            className={`relative ${stage === "fetching" ? "animate-fly-in" : ""}`}
            style={{
              // @ts-ignore
              '--start-x': `${startX}px`,
              '--start-y': `${startY}px`,
              animationDelay: `${idx * 0.2}s`,
            }}
          >
            <div className={`
              w-24 h-24 border-2 border-white flex items-center justify-center
              ${stage === "fetching" ? "animate-pulse-glow" : ""}
            `}>
              <span className="text-xs font-mono text-white/80">{hash}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
