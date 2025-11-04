import { Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SolanaBlock } from "../../../lib/types";

type Props = {
  blocks: SolanaBlock[];
  beaconHex: string | null;
};

export function BlocksPanel({ blocks, beaconHex }: Props) {
  const copy = (t: string) => navigator.clipboard.writeText(t);

  return (
    <>
      <div className="text-sm font-medium text-muted-foreground mb-2">
        1) Source: Solana finalized blocks
      </div>

      {blocks.length === 0 ? (
        <div className="text-sm text-muted-foreground">Waiting for finalized blocks…</div>
      ) : (
        <div className="space-y-2 mb-4">
          {blocks.map((b) => (
            <div
              key={b.slot}
              className="flex items-center justify-between p-3 bg-card border border-border rounded-lg"
            >
              <div className="flex-1">
                <div className="text-sm font-medium text-foreground">slot #{b.slot}</div>
                <code className="text-xs font-mono text-muted-foreground break-all">{b.blockhash}</code>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <a href={b.explorerUrl} target="_blank" rel="noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      )}

      {beaconHex && (
        <div className="mt-4">
          <div className="text-sm font-medium text-muted-foreground mb-2">
            2) Beacon (concatenate base58→bytes of block hashes)
          </div>
          <div className="flex items-center gap-2 p-3 bg-card border border-border rounded-lg">
            <code className="text-xs font-mono text-foreground break-all flex-1">{beaconHex}</code>
            <Button variant="ghost" size="sm" onClick={() => copy(beaconHex)}>
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
