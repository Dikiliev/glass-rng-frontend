export const ByteTransformation = () => {
  const chars = "5hVfwX7d8kLmpQ2x3nTyzR9w7vBnjK4m".split("");

  return (
    <div className="flex flex-wrap gap-2 max-w-2xl justify-center">
      {chars.map((char, idx) => (
        <span
          key={idx}
          className="font-mono text-lg animate-char-flip"
          style={{
            animationDelay: `${idx * 0.05}s`,
            color: 'hsl(var(--accent-animation))',
          }}
        >
          {char}
        </span>
      ))}
    </div>
  );
};
