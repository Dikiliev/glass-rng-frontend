import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import FloatingDigits from "@/components/FloatingDigits";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface HistoryEntry {
  id: string;
  result: number;
  timestamp: string;
  blockHashes: string[];
  concatenatedString: string;
  noiseData: string;
}

const History = () => {
  const [openItems, setOpenItems] = useState<string[]>([]);

  const historyData: HistoryEntry[] = Array.from({ length: 10 }, (_, i) => ({
    id: `gen-${i}`,
    result: Math.floor(Math.random() * 10),
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    blockHashes: Array.from({ length: 4 }, () => 
      `${Math.random().toString(36).substring(2, 8)}...${Math.random().toString(36).substring(2, 6)}`
    ),
    concatenatedString: Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2),
    noiseData: `OS_RNG: 0x${Math.random().toString(16).substring(2, 18)} | CPU_JITTER: 0x${Math.random().toString(16).substring(2, 18)}`,
  }));

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen pt-20 relative overflow-hidden">
      <FloatingDigits />
      
      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Generation History
            </h1>
            <p className="text-muted-foreground">
              Complete record of all generated numbers
            </p>
          </div>

          <div className="space-y-4">
            {historyData.map((entry, index) => (
              <Collapsible
                key={entry.id}
                open={openItems.includes(entry.id)}
                onOpenChange={() => toggleItem(entry.id)}
              >
                <Card 
                  className="border-border hover:border-primary/50 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CollapsibleTrigger className="w-full">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="text-5xl font-bold font-mono text-primary">
                            {entry.result}
                          </div>
                          <div className="text-left">
                            <div className="text-sm text-muted-foreground">Generated at</div>
                            <div className="text-foreground font-mono text-sm">
                              {new Date(entry.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        {openItems.includes(entry.id) ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <CardContent className="pt-0 pb-6 px-6">
                      <div className="border-t border-border pt-6 space-y-4 font-mono text-sm">
                        <div className="space-y-2">
                          <div className="text-muted-foreground uppercase text-xs tracking-wider">
                            Solana Block Hashes
                          </div>
                          <div className="space-y-1">
                            {entry.blockHashes.map((hash, i) => (
                              <div key={i} className="text-accent break-all p-2 bg-muted rounded">
                                {hash}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-muted-foreground uppercase text-xs tracking-wider">
                            Concatenated String
                          </div>
                          <div className="text-secondary break-all p-2 bg-muted rounded">
                            {entry.concatenatedString}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-muted-foreground uppercase text-xs tracking-wider">
                            Environmental Noise
                          </div>
                          <div className="text-foreground break-all p-2 bg-muted rounded">
                            {entry.noiseData}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default History;
