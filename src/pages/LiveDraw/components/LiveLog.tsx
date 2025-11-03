import { Card, CardContent } from "@/components/ui/card";
import type { AnyEvent } from "../types";

type Props = { events: AnyEvent[] };

export function LiveLog({ events }: Props) {
  return (
    <Card className="border-border bg-card/50">
      <CardContent className="p-4">
        <div className="text-sm font-medium text-muted-foreground mb-3">Live log</div>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {events.map((e, idx) => (
            <div key={idx} className="p-2 bg-muted rounded text-xs">
              <div className="font-medium text-foreground mb-1">{e.type}</div>
              <code className="text-xs text-muted-foreground break-all">
                {JSON.stringify(e, null, 2)}
              </code>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
