import { CheckCircle, Clock, Loader2, Sparkles } from "lucide-react";

type Props = {
  status: "waiting" | "committed" | "finalized" | "mixing" | "done";
  inputs: string[];
  statusNote: string | null;
  collectOpen?: boolean;
  collectRemainMs?: number | null;
};

export function StatusBar({ status, inputs, statusNote, collectOpen, collectRemainMs }: Props) {
  const getStatusChip = () => {
    switch (status) {
      case "done":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-500 rounded-full text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Done</span>
          </div>
        );
      case "mixing":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm">
            <Sparkles className="w-4 h-4" />
            <span>Mixing...</span>
          </div>
        );
      case "finalized":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-500 rounded-full text-sm">
            <span>Blocks finalized</span>
          </div>
        );
      case "committed":
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-muted text-foreground rounded-full text-sm">
            <span>Committed</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2 px-3 py-1 bg-muted text-foreground rounded-full text-sm">
            <Clock className="w-4 h-4" />
            <span>Waiting...</span>
          </div>
        );
    }
  };

  return (
    <>
      <div className="flex items-center gap-4 flex-wrap">
        <div className="text-lg font-semibold text-foreground">Status</div>
        {getStatusChip()}
        {inputs.length > 0 && (
          <div className="flex gap-2">
            {inputs.map((s) => (
              <div
                key={s}
                className="text-xs bg-muted px-2 py-1 rounded text-foreground"
              >
                src:{s}
              </div>
            ))}
          </div>
        )}
      </div>
      {statusNote && (
        <div className="text-sm text-muted-foreground mt-2">{statusNote}</div>
      )}

      {collectOpen && (
        <div className="mt-2 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg text-sm text-blue-300">
          Сбор серверного шума…{" "}
          {collectRemainMs != null ? Math.ceil(collectRemainMs / 1000) : ""} c
        </div>
      )}
    </>
  );
}
