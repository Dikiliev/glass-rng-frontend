import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Props = {
  seedHex: string | null;
  result: string | null;
};

export function ResultPanel({ seedHex, result }: Props) {
  const copy = (t: string) => navigator.clipboard.writeText(t);

  return (
    <>
      <div className="text-sm font-medium text-muted-foreground mb-2">Итог (после смешивания)</div>
      <Card className="border-border bg-card/50">
        <CardContent className="p-4">
          <div className="text-xs text-muted-foreground mb-2">Seed (HKDF)</div>
          <div className="flex items-center gap-2 break-all">
            <code className="text-xs font-mono text-foreground bg-muted px-2 py-1 rounded">
              {seedHex ?? "—"}
            </code>
            {seedHex && (
              <Button variant="ghost" size="sm" onClick={() => copy(seedHex)}>
                <Copy className="w-4 h-4" />
              </Button>
            )}
          </div>
          <Separator className="my-2" />
          <div className="text-2xl font-semibold text-foreground">{result ?? "…"}</div>
          <div className="text-xs text-muted-foreground mt-1">u64 ∈ 0..2^64−1</div>
        </CardContent>
      </Card>
    </>
  );
}
