import { Card, CardContent } from "@/components/ui/card";

type Props = {
  locBytes: number;
  locPackets: number;
  locRoot: string | null;
  summary?: {
    urandomBytes?: number;
    jitterBatches?: number;
    jitterBytes?: number;
    jitterSamplesTotal?: number;
  } | null;
};

export function ServerEntropyPanel({ locBytes, locPackets, locRoot, summary }: Props) {
  return (
    <Card className="border-border bg-card/50">
      <CardContent className="p-4">
        <div className="text-sm font-medium text-muted-foreground mb-3">Server entropy</div>
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="text-xs bg-muted px-2 py-1 rounded text-foreground">LOC bytes: {locBytes}</div>
          <div className="text-xs bg-muted px-2 py-1 rounded text-foreground">packets: {locPackets}</div>
          {locRoot && (
            <div className="text-xs bg-muted px-2 py-1 rounded text-foreground">
              root: {locRoot.slice(0, 10)}…
            </div>
          )}
          {summary?.urandomBytes != null && (
            <div className="text-xs bg-muted px-2 py-1 rounded text-foreground">
              urandom: {summary.urandomBytes} B
            </div>
          )}
          {summary?.jitterBatches != null && (
            <div className="text-xs bg-muted px-2 py-1 rounded text-foreground">
              jitter batches: {summary.jitterBatches}
            </div>
          )}
          {summary?.jitterBytes != null && (
            <div className="text-xs bg-muted px-2 py-1 rounded text-foreground">
              jitter bytes: {summary.jitterBytes}
            </div>
          )}
          {summary?.jitterSamplesTotal != null && (
            <div className="text-xs bg-muted px-2 py-1 rounded text-foreground">
              jitter samples: {summary.jitterSamplesTotal}
            </div>
          )}
        </div>
        <div className="text-xs text-muted-foreground">
          These bytes are collected on the server (OS RNG + CPU jitter) before mixing.
        </div>
      </CardContent>
    </Card>
  );
}
