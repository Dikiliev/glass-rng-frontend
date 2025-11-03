import { useEffect, useState } from "react";

interface Digit {
  id: number;
  value: number;
  size: number;
  duration: number;
  delay: number;
  x: number;
  y: number;
}

const FloatingDigits = () => {
  const [digits, setDigits] = useState<Digit[]>([]);

  useEffect(() => {
    const generateDigits = () => {
      const newDigits: Digit[] = [];
      for (let i = 0; i < 20; i++) {
        newDigits.push({
          id: i,
          value: Math.floor(Math.random() * 10),
          size: Math.random() * 60 + 40,
          duration: Math.random() * 20 + 20,
          delay: Math.random() * 10,
          x: Math.random() * 100,
          y: Math.random() * 100,
        });
      }
      setDigits(newDigits);
    };

    generateDigits();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-20">
      {digits.map((digit) => (
        <div
          key={digit.id}
          className="absolute font-mono text-primary animate-drift"
          style={{
            fontSize: `${digit.size}px`,
            left: `${digit.x}%`,
            top: `${digit.y}%`,
            animationDuration: `${digit.duration}s`,
            animationDelay: `${digit.delay}s`,
          }}
        >
          {digit.value}
        </div>
      ))}
    </div>
  );
};

export default FloatingDigits;
