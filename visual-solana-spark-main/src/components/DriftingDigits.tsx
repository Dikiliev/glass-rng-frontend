import { useEffect, useState } from "react";

interface Digit {
  id: number;
  value: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  driftX: number;
  driftY: number;
  rotate: number;
  duration: number;
}

export const DriftingDigits = () => {
  const [digits, setDigits] = useState<Digit[]>([]);

  useEffect(() => {
    const generateDigits = () => {
      const newDigits: Digit[] = [];
      for (let i = 0; i < 30; i++) {
        newDigits.push({
          id: i,
          value: Math.floor(Math.random() * 10),
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 80 + 40,
          opacity: Math.random() * 0.15 + 0.05,
          driftX: (Math.random() - 0.5) * 200,
          driftY: (Math.random() - 0.5) * 200,
          rotate: (Math.random() - 0.5) * 360,
          duration: Math.random() * 40 + 40,
        });
      }
      setDigits(newDigits);
    };

    generateDigits();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {digits.map((digit) => (
        <div
          key={digit.id}
          className="absolute font-mono font-bold animate-drift"
          style={{
            left: `${digit.x}%`,
            top: `${digit.y}%`,
            fontSize: `${digit.size}px`,
            opacity: digit.opacity,
            // @ts-ignore
            '--drift-x': `${digit.driftX}px`,
            '--drift-y': `${digit.driftY}px`,
            '--drift-rotate': `${digit.rotate}deg`,
            animationDuration: `${digit.duration}s`,
          }}
        >
          {digit.value}
        </div>
      ))}
    </div>
  );
};
