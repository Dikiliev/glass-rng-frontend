import { useEffect, useMemo, useRef } from "react";
import { Stack, Typography, Card, Grid, CardContent, Divider } from "@mui/material";
import { useLocation, useParams } from "react-router-dom";
import { startSolanaDraw } from "../../lib/api";

import { useDrawSSE } from "./hooks/useDrawSSE";
import { StatusBar } from "./components/StatusBar";
import { BlocksPanel } from "./components/BlocksPanel";
import { ResultPanel } from "./components/ResultPanel";
import { TracePanel } from "./components/TracePanel";
import { InterpretationPanel } from "./components/InterpretationPanel";
import { ServerEntropyPanel } from "./components/ServerEntropyPanel";  // ⬅️ new
import { ComparePanel } from "./components/ComparePanel";              // ⬅️ new
import { LiveLog } from "./components/LiveLog";

export default function LiveDraw() {
  const { drawId = "" } = useParams();
  const qs = new URLSearchParams(useLocation().search);
  const mode = qs.get("mode");
  const blocksCount = parseInt(qs.get("blocks") || "3", 10);

  const {
    events, statusNote, inputs,
    blocksList, beaconHex, seedHex, result, trace,
    locBytes, locPackets, locRoot,
    collectOpen, collectRemainMs,
    locSummary, compare,               // ⬅️ new
  } = useDrawSSE(drawId);

  const startedRef = useRef(false);
  useEffect(() => {
    if (!drawId || startedRef.current) return;
    startedRef.current = true;

    if (mode === "solana-blocks") {
      startSolanaDraw({
        draw_id: drawId,
        blocks: blocksCount,
        collect_ms: 8000,
        srv_jitter: true,
        srv_jitter_samples: 12000,
        srv_urandom_bytes: 1024,
      }).catch(console.error);
    }
  }, [drawId, mode, blocksCount]);

  const status = useMemo(() => {
    const types = events.map(e => e.type);
    if (types.includes("result")) return "done";
    if (types.includes("mix.start")) return "mixing";
    if (types.includes("block.finalized_all")) return "finalized";
    if (types.includes("commit")) return "committed";
    return "waiting";
  }, [events]);

  return (
      <Stack spacing={3}>
        <Typography variant="h5">Draw: {drawId}</Typography>

        <Card variant="outlined">
          <CardContent>
            <StatusBar
                status={status}
                inputs={inputs}
                statusNote={statusNote}
                collectOpen={collectOpen}
                collectRemainMs={collectRemainMs}
            />
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 7 }}>
                <BlocksPanel blocks={blocksList} beaconHex={beaconHex} />
              </Grid>
              <Grid size={{ xs: 12, md: 5 }}>
                <ResultPanel seedHex={seedHex} result={result} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {trace && <TracePanel trace={trace} />}

        {/* Влияние шума: результат без LOC vs с LOC */}
        {compare && <ComparePanel pub={compare.pub} pub_loc={compare.pub_loc} />}

        {/* Сводка по серверной энтропии */}
        <ServerEntropyPanel
            locBytes={locBytes}
            locPackets={locPackets}
            locRoot={locRoot}
            summary={locSummary ? {
              urandomBytes: locSummary.urandomBytes,
              jitterBatches: locSummary.jitterBatches,
              jitterBytes: locSummary.jitterBytes,
              jitterSamplesTotal: locSummary.jitterSamplesTotal,
            } : null}
        />

        <InterpretationPanel result={result} />

        <LiveLog events={events} />
      </Stack>
  );
}
