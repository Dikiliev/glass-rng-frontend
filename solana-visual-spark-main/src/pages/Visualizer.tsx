import { useState } from "react";
import { FileText } from "lucide-react";
import FloatingDigits from "@/components/FloatingDigits";
import AnimatedGeneration from "@/components/AnimatedGeneration";
import GenerationLog from "@/components/GenerationLog";
import { Button } from "@/components/ui/button";

const Visualizer = () => {
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [currentGeneration, setCurrentGeneration] = useState({
    result: 7,
    timestamp: new Date().toISOString(),
    blockHashes: [
      "5hVfGjWzt7dX8qRvPkLmQwEaCnB4tYuH3fVxZ9mH7kJ2",
      "8kLmPqRsT3vUwXyZ2bC5dEfG7hJkL9mN4pQrS6tUvW",
      "2xRtYuI9oP8qWsZ3xCvBnM6lKjH5gFdS4aR7eT1yU",
      "6wQzAsD4fGhJkL2mN5pRtV8xYbC9eH7iK3lM4oQ1s",
    ],
    concatenatedString: "5hVfGjWzt7dX8qRvPkLmQwEaCnB4tYuH3fVxZ9mH7kJ28kLmPqRsT3vUwXyZ2bC5dEfG7hJkL9mN4pQrS6tUvW2xRtYuI9oP8qWsZ3xCvBnM6lKjH5gFdS4aR7eT1yU6wQzAsD4fGhJkL2mN5pRtV8xYbC9eH7iK3lM4oQ1s",
    noiseData: "OS_RNG: 0x3F8D2A1B4C7E9F6D | CPU_JITTER: 0x8A4C9E2F1D7B5A3C",
  });

  const handleGenerationComplete = (result: number) => {
    setCurrentGeneration({
      result,
      timestamp: new Date().toISOString(),
      blockHashes: [
        `${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
        `${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
        `${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
        `${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`,
      ],
      concatenatedString: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2),
      noiseData: `OS_RNG: 0x${Math.random().toString(16).substring(2, 18)} | CPU_JITTER: 0x${Math.random().toString(16).substring(2, 18)}`,
    });
  };

  return (
    <div className="min-h-screen pt-20 relative overflow-hidden">
      <FloatingDigits />
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Provably Fair Random Number Generator
            </h1>
            <p className="text-muted-foreground text-lg">
              Watch every step of the generation process in real-time
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl mb-8">
            <AnimatedGeneration onComplete={handleGenerationComplete} />
          </div>

          <div className="flex justify-center">
            <Button
              onClick={() => setIsLogOpen(true)}
              variant="outline"
              className="gap-2 border-primary/30 hover:border-primary hover:bg-primary/10 transition-all duration-300"
            >
              <FileText className="w-4 h-4" />
              View Generation Log
            </Button>
          </div>
        </div>
      </div>

      <GenerationLog
        isOpen={isLogOpen}
        onClose={() => setIsLogOpen(false)}
        data={currentGeneration}
      />
    </div>
  );
};

export default Visualizer;
