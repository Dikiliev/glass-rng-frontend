import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link to="/">
            <Button variant="ghost" className="gap-2 text-white hover:bg-white/10 mb-8">
              <ArrowLeft className="w-4 h-4" />
              Back to Visualizer
            </Button>
          </Link>
          <h1 className="text-5xl font-bold tracking-tight mb-4">About This Project</h1>
          <p className="text-xl text-white/70">
            Transparent, Verifiable, Provably Fair Random Generation
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* What is Provably Fair */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6" />
              <h2 className="text-2xl font-bold">What is Provably Fair?</h2>
            </div>
            <p className="text-white/80 leading-relaxed">
              Provably fair generation means that every number produced by our system can be 
              independently verified by anyone. Unlike traditional random number generators that 
              operate as "black boxes," our algorithm is completely transparent and uses publicly 
              verifiable data from the Solana blockchain.
            </p>
            <div className="border-l-2 border-white/30 pl-6 py-2">
              <p className="text-white/70 italic">
                "Trust, but verify" - every generation can be audited using only public data.
              </p>
            </div>
          </section>

          {/* How It Works */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-6 h-6" />
              <h2 className="text-2xl font-bold">How It Works</h2>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white/90">1. Blockchain Data Collection</h3>
                <p className="text-white/70">
                  We fetch recent block hashes from the Solana blockchain. These hashes are 
                  cryptographically secure, publicly available, and impossible to manipulate.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white/90">2. Data Concatenation</h3>
                <p className="text-white/70">
                  Multiple block hashes are combined into a single string, creating a larger 
                  pool of randomness derived from decentralized sources.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white/90">3. Environmental Noise</h3>
                <p className="text-white/70">
                  We add unpredictable cryptographic noise (derived from timestamp, user agent, 
                  and system entropy) to ensure each generation is unique and unreproducible.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-white/90">4. Final Calculation</h3>
                <p className="text-white/70">
                  The combined data is processed through a cryptographic hash function, and the 
                  result is reduced to a single digit (0-9) using modular arithmetic.
                </p>
              </div>
            </div>

            {/* Visual Diagram */}
            <div className="mt-8 p-8 border border-white/20 bg-white/5">
              <div className="space-y-6 font-mono text-sm">
                <div className="flex items-center gap-4">
                  <div className="w-32 text-right text-white/60">Blockchain</div>
                  <div className="text-white/40">→</div>
                  <div className="flex-1 text-white/80">[Block Hash 1, Block Hash 2, ...]</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 text-right text-white/60">Concatenate</div>
                  <div className="text-white/40">→</div>
                  <div className="flex-1 text-white/80">[Combined String]</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 text-right text-white/60">Add Noise</div>
                  <div className="text-white/40">→</div>
                  <div className="flex-1 text-white/80">[Combined String + Entropy]</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 text-right text-white/60">Calculate</div>
                  <div className="text-white/40">→</div>
                  <div className="flex-1 text-white/80">[Final Digit: 0-9]</div>
                </div>
              </div>
            </div>
          </section>

          {/* Why Solana */}
          <section className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <Lock className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Why Solana?</h2>
            </div>
            <p className="text-white/80 leading-relaxed">
              Solana is one of the fastest and most secure blockchains in existence. Its high 
              throughput and sub-second block times make it ideal for real-time applications. 
              By anchoring our random generation to Solana's immutable ledger, we ensure that 
              the source of randomness is both tamper-proof and publicly auditable.
            </p>
          </section>

          {/* Technical Note */}
          <section className="border border-white/30 p-6 bg-white/5">
            <h3 className="text-lg font-semibold mb-2">Technical Note</h3>
            <p className="text-white/70 text-sm leading-relaxed">
              This is a visual demonstration using mock data. In a production environment, 
              the system would connect to live Solana RPC endpoints to fetch real-time block 
              data. The animation visualizes the exact algorithm that would be used in the 
              production system.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
