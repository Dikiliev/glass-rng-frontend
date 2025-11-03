import FloatingDigits from "@/components/FloatingDigits";
import { Card, CardContent } from "@/components/ui/card";
import { Database, Shield, Zap, Network } from "lucide-react";

const About = () => {
  const steps = [
    {
      icon: Database,
      title: "Solana Blockchain Data",
      description: "We fetch recent block hashes from the Solana blockchain - a public, immutable, and verifiable source of randomness.",
    },
    {
      icon: Network,
      title: "Hash Concatenation",
      description: "Multiple block hashes are combined and converted from Base58 to bytes, creating a complex data pattern.",
    },
    {
      icon: Zap,
      title: "Environmental Noise",
      description: "We add unpredictable entropy from OS random number generators and CPU timing jitter to enhance randomness.",
    },
    {
      icon: Shield,
      title: "Provably Fair Output",
      description: "The final result is calculated deterministically, but the inputs are completely unpredictable and verifiable.",
    },
  ];

  return (
    <div className="min-h-screen pt-20 relative overflow-hidden">
      <FloatingDigits />
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              How It Works
            </h1>
            <p className="text-muted-foreground text-lg">
              Understanding provably fair random number generation
            </p>
          </div>

          <div className="space-y-8 mb-12">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <Card 
                  key={index}
                  className="border-border hover:border-primary/50 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2 text-foreground">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="border-primary/30 bg-primary/5 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4 text-primary">Why Provably Fair?</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Traditional random number generators are often "black boxes" - you have to trust that they're truly random. Our system is different.
                </p>
                <p>
                  By using data from a public blockchain (Solana), every generation can be independently verified. The block hashes are public and immutable, meaning anyone can check that we're using real blockchain data.
                </p>
                <p>
                  Combined with environmental noise from your system, this creates a truly unpredictable result that's also completely transparent and verifiable.
                </p>
                <p className="text-primary font-medium">
                  Trust through transparency, not through secrecy.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;
