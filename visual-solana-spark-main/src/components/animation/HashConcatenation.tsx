export const HashConcatenation = () => {
  const hashes = ["5hVf...wX7d", "8kLm...pQ2x", "3nTy...zR9w", "7vBn...jK4m"];

  return (
    <div className="flex items-center gap-2">
      {hashes.map((hash, idx) => (
        <div
          key={idx}
          className="animate-flow-together"
          style={{
            // @ts-ignore
            '--offset-x': `${(idx - 1.5) * 100}px`,
            animationDelay: `${idx * 0.15}s`,
          }}
        >
          <span className="text-sm font-mono text-white">{hash}</span>
          {idx < hashes.length - 1 && (
            <span className="text-white/40 mx-1">+</span>
          )}
        </div>
      ))}
    </div>
  );
};
