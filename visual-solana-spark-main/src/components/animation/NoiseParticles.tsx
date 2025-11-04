interface NoiseParticlesProps {
  applying?: boolean;
}

export const NoiseParticles = ({ applying = false }: NoiseParticlesProps) => {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 400,
    y: (Math.random() - 0.5) * 400,
    rotate: Math.random() * 360,
    delay: Math.random() * 0.5,
  }));

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute w-1 h-1 rounded-full bg-cyan-400 ${
            applying ? "animate-glitch" : "animate-particle-chaos"
          }`}
          style={{
            // @ts-ignore
            '--particle-x': `${particle.x}px`,
            '--particle-y': `${particle.y}px`,
            '--particle-rotate': `${particle.rotate}deg`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
      {applying && (
        <div className="text-cyan-400 text-4xl font-mono animate-glitch">
          ⚡
        </div>
      )}
    </div>
  );
};
