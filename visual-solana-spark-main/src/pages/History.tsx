import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { mockHistory } from "@/lib/mockData";

const History = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" className="gap-2 text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4" />
              Back to Visualizer
            </Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Generation History</h1>
          <div className="w-32" /> {/* Spacer for balance */}
        </div>

        {/* History List */}
        <div className="space-y-4">
          {mockHistory.map((entry) => (
            <div
              key={entry.id}
              className="border border-white/20 bg-black hover:border-white/40 transition-colors"
            >
              <button
                onClick={() => setExpandedId(expandedId === entry.id ? null : entry.id)}
                className="w-full p-6 flex items-center justify-between text-left"
              >
                <div className="flex items-center gap-6">
                  <span className="text-6xl font-mono font-bold">{entry.result}</span>
                  <div>
                    <p className="text-sm text-white/60">Generated at</p>
                    <p className="font-mono text-lg">{entry.timestamp}</p>
                  </div>
                </div>
                {expandedId === entry.id ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>

              {expandedId === entry.id && (
                <div className="border-t border-white/20 p-6 space-y-4 animate-fade-in">
                  <div>
                    <h3 className="text-sm text-white/60 mb-2">Block Hashes Used:</h3>
                    <div className="space-y-1">
                      {entry.blockHashes.map((hash, idx) => (
                        <p key={idx} className="font-mono text-xs text-white/80 break-all">
                          {hash}
                        </p>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm text-white/60 mb-2">Concatenated String:</h3>
                    <p className="font-mono text-xs text-white/80 break-all">
                      {entry.concatenated}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm text-white/60 mb-2">Environmental Noise:</h3>
                    <p className="font-mono text-xs text-white/80 break-all">
                      {entry.noise}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm text-white/60 mb-2">Final Calculation:</h3>
                    <p className="font-mono text-xs text-white/80">
                      Result = ({entry.concatenated.slice(0, 20)}... XOR {entry.noise.slice(0, 20)}...) % 10
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
