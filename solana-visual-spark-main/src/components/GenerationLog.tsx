import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GenerationData {
  result: number;
  timestamp: string;
  blockHashes: string[];
  concatenatedString: string;
  noiseData: string;
}

interface GenerationLogProps {
  isOpen: boolean;
  onClose: () => void;
  data: GenerationData;
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
            <div className="space-y-2">
              <div className="text-muted-foreground uppercase text-xs tracking-wider">Final Result</div>
              <div className="text-6xl font-bold text-primary">{data.result}</div>
            </div>

            <div className="space-y-2">
              <div className="text-muted-foreground uppercase text-xs tracking-wider">Timestamp</div>
              <div className="text-foreground">{data.timestamp}</div>
            </div>

            <div className="space-y-2">
              <div className="text-muted-foreground uppercase text-xs tracking-wider">
                Solana Block Hashes ({data.blockHashes.length})
              </div>
              <div className="space-y-1">
                {data.blockHashes.map((hash, index) => (
                  <div key={index} className="text-accent break-all p-2 bg-muted rounded">
                    {hash}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-muted-foreground uppercase text-xs tracking-wider">
                Concatenated String
              </div>
              <div className="text-secondary break-all p-3 bg-muted rounded">
                {data.concatenatedString}
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-muted-foreground uppercase text-xs tracking-wider">
                Environmental Noise Data
              </div>
              <div className="text-foreground break-all p-3 bg-muted rounded">
                {data.noiseData}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default GenerationLog;
