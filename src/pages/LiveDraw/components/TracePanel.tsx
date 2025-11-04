import { Card, CardContent } from "@/components/ui/card";
import type { MixTraceEvent } from "../types";

type Props = { trace: MixTraceEvent };

export function TracePanel({ trace }: Props) {
  return (
    <Card className="border-border bg-card/50">
      <CardContent className="p-4">
        <div className="text-sm font-medium text-muted-foreground mb-2">
          How the number is derived — step by step
        </div>
        <div className="space-y-1 mb-4 text-sm text-foreground">
          <div>3) Source hashing: H("SOL"‖beacon).</div>
          <div>4) HKDF with salt from drawId → seed.</div>
          <div>5) ChaCha20(seed) → first 8 bytes = u64.</div>
          <div>6) Normalization: u64 / 2^64 → [0,1).</div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="text-foreground">
            <b>beaconHex:</b>{" "}
            <code className="text-xs font-mono text-muted-foreground break-all bg-muted px-1 rounded">
              {trace.beaconHex}
            </code>
          </div>
          <div className="text-foreground">
            <b>H("SOL"‖beacon):</b>{" "}
            <code className="text-xs font-mono text-muted-foreground break-all bg-muted px-1 rounded">
              {trace.pubComponentHex}
            </code>
          </div>
          <div className="text-foreground">
            <b>HKDF salt:</b>{" "}
            <code className="text-xs font-mono text-muted-foreground bg-muted px-1 rounded">
              {trace.hkdfSaltHex}
            </code>
          </div>
          <div className="text-foreground">
            <b>seed:</b>{" "}
            <code className="text-xs font-mono text-muted-foreground break-all bg-muted px-1 rounded">
              {trace.seedHex}
            </code>
          </div>
          <div className="text-foreground">
            <b>ChaCha first 16 bytes:</b>{" "}
            <code className="text-xs font-mono text-muted-foreground bg-muted px-1 rounded">
              {trace.chachaFirst16Hex}
            </code>
          </div>
          <div className="text-foreground">
            <b>u64:</b>{" "}
            <code className="text-xs font-mono text-muted-foreground bg-muted px-1 rounded">
              {trace.u64}
            </code>
          </div>
          <div className="text-foreground">
            <b>u ∈ [0,1) (server):</b>{" "}
            <code className="text-xs font-mono text-muted-foreground bg-muted px-1 rounded">
              {trace.u01.decimal18}
            </code>{" "}
            <span className="text-muted-foreground">
              ({trace.u01.fraction.num}/{trace.u01.fraction.den})
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
