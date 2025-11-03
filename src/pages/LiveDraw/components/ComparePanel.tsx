import { Copy, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Side = {
  title: string;
  seedHex: string;
  chachaFirst16Hex: string;
  u64: string;
  u01dec: string;
};

function SideCard({ title, seedHex, chachaFirst16Hex, u64, u01dec }: Side) {
  const copy = (t: string) => navigator.clipboard.writeText(t);
  return (
    <Card className="border-border bg-card/50">
      <CardContent className="p-4">
        <div className="text-sm font-medium text-muted-foreground mb-3">{title}</div>
        <div className="text-xs text-muted-foreground mb-1">Seed</div>
        <div className="flex items-center gap-2 break-all mb-2">
          <code className="text-xs font-mono text-foreground bg-muted px-1 py-0.5 rounded flex-1">
            {seedHex}
          </code>
          <Button variant="ghost" size="sm" onClick={() => copy(seedHex)}>
            <Copy className="w-4 h-4" />
          </Button>
        </div>

        <Separator className="my-2" />
        <div className="text-xs text-muted-foreground mb-1">ChaCha first 16B</div>
        <code className="text-xs font-mono text-foreground bg-muted px-1 py-0.5 rounded">
          {chachaFirst16Hex}
        </code>

        <Separator className="my-2" />
        <div className="text-xs text-muted-foreground mb-1">u64</div>
        <div className="text-lg font-semibold text-foreground mb-2">{u64}</div>

        <div className="text-xs text-muted-foreground mb-1">u ∈ [0,1)</div>
        <code className="text-xs font-mono text-foreground bg-muted px-1 py-0.5 rounded">{u01dec}</code>
      </CardContent>
    </Card>
  );
}

type Props = {
  pub: { seedHex: string; chachaFirst16Hex: string; u64: string; u01: { decimal18: string } };
  pub_loc: {
    seedHex: string;
    chachaFirst16Hex: string;
    u64: string;
    u01: { decimal18: string };
  };
};

export function ComparePanel({ pub, pub_loc }: Props) {
  const changed = pub.u64 !== pub_loc.u64;
  return (
    <Card className="border-border bg-card/50">
      <CardContent className="p-4">
        <div className="text-lg font-semibold text-foreground mb-4">
          Влияние шума: до/после смешивания
          <span className="text-sm font-normal text-muted-foreground ml-2">
            {changed ? "— результат изменился" : "— результат совпал"}
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SideCard
            title="Только блоки (PUB)"
            seedHex={pub.seedHex}
            chachaFirst16Hex={pub.chachaFirst16Hex}
            u64={pub.u64}
            u01dec={pub.u01.decimal18}
          />
          <SideCard
            title="Блоки + локальный шум (PUB+LOC)"
            seedHex={pub_loc.seedHex}
            chachaFirst16Hex={pub_loc.chachaFirst16Hex}
            u64={pub_loc.u64}
            u01dec={pub_loc.u01.decimal18}
          />
        </div>
      </CardContent>
    </Card>
  );
}
