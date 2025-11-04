import { GenerationAnimation } from "@/components/GenerationAnimation";
import { DriftingDigits } from "@/components/DriftingDigits";
import { Button } from "@/components/ui/button";
import { Code } from "lucide-react";
import { Link } from "react-router-dom";

const Main = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <DriftingDigits />
      
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-50 flex justify-between items-center p-6">
        <h1 className="text-xl font-bold tracking-tight">THE VISUAL SOLANA RANDOMIZER</h1>
        <div className="flex gap-4">
          <Link to="/history">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              History
            </Button>
          </Link>
          <Link to="/about">
            <Button variant="ghost" className="text-white hover:bg-white/10">
              About
            </Button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <GenerationAnimation />
        
        <div className="mt-8 text-center space-y-4">
          <p className="text-sm tracking-wide opacity-80">
            Generated using Solana blockchain + cryptographic noise
          </p>
          
          <Link to="/history">
            <Button variant="outline" className="gap-2 border-white/30 hover:bg-white/10">
              <Code className="w-4 h-4" />
              View Log
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Main;
