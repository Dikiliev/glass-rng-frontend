import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GenerationLogProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    result: number | null;
    timestamp?: string;
    blocks?: any[];
    beaconHex?: string | null;
    seedHex?: string | null;
    trace?: any;
    locSummary?: any;
    events?: any[];
  };
}

const GenerationLog = ({ isOpen, onClose, data }: GenerationLogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Generation Log
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6 font-mono text-sm">
            {data.result !== null && data.result !== undefined && (
              <div className="space-y-2">
                <div className="text-muted-foreground uppercase text-xs tracking-wider">Final Result</div>
                <div className="text-6xl font-bold text-primary">{data.result}</div>
              </div>
            )}

            {data.seedHex && (
              <div className="space-y-2">
                <div className="text-muted-foreground uppercase text-xs tracking-wider">Seed (Hex)</div>
                <div className="text-foreground break-all p-3 bg-muted rounded">{data.seedHex}</div>
              </div>
            )}

            {data.beaconHex && (
              <div className="space-y-2">
                <div className="text-muted-foreground uppercase text-xs tracking-wider">Beacon (Hex)</div>
                <div className="text-accent break-all p-3 bg-muted rounded">{data.beaconHex}</div>
              </div>
            )}

            {data.blocks && data.blocks.length > 0 && (
              <div className="space-y-2">
                <div className="text-muted-foreground uppercase text-xs tracking-wider">
                  Solana Block Hashes ({data.blocks.length})
                </div>
                <div className="space-y-1">
                  {data.blocks.map((block: any, index: number) => {
                    const hash = block?.blockhash || block?.hash || block || "";
                    return (
                      <div key={index} className="text-accent break-all p-2 bg-muted rounded">
                        {hash}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {data.trace && (
              <div className="space-y-2">
                <div className="text-muted-foreground uppercase text-xs tracking-wider">Trace</div>
                <div className="text-secondary break-all p-3 bg-muted rounded">
                  <pre className="whitespace-pre-wrap text-xs">
                    {JSON.stringify(data.trace, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {data.locSummary && (
              <div className="space-y-2">
                <div className="text-muted-foreground uppercase text-xs tracking-wider">
                  Environmental Noise Summary
                </div>
                <div className="text-foreground break-all p-3 bg-muted rounded">
                  <pre className="whitespace-pre-wrap text-xs">
                    {JSON.stringify(data.locSummary, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {data.events && data.events.length > 0 && (
              <div className="space-y-2">
                <div className="text-muted-foreground uppercase text-xs tracking-wider">
                  Events ({data.events.length})
                </div>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {data.events.slice(-20).map((event: any, index: number) => (
                    <div key={index} className="text-xs p-2 bg-muted rounded">
                      <span className="text-accent">{event.type}</span>
                      {event.note && <span className="text-muted-foreground ml-2">{event.note}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default GenerationLog;


