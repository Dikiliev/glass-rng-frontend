import { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import { startSolanaDraw } from "../lib/api";
import { subscribeDrawSSE } from "../lib/stream";
import type { DrawEvent, SolanaBlock } from "../lib/types";
import {
  Box, Card, CardContent, Chip, Divider, Grid, IconButton, Link, List, ListItem, ListItemText,
  Stack, Tooltip, Typography
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

export default function LiveDraw() {
  const { drawId = "" } = useParams();
  const loc = useLocation();
  const qs = new URLSearchParams(loc.search);

  const mode = qs.get("mode");                  // "solana-blocks"
  const blocksCount = parseInt(qs.get("blocks") || "3", 10); // <-- только число для старта

  const [events, setEvents] = useState<DrawEvent[]>([]);
  const [seedHex, setSeedHex] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [blocksList, setBlocksList] = useState<SolanaBlock[]>([]); // <-- используем это в UI
  const startedRef = useRef(false);

  // 1) Сначала открываем SSE
  useEffect(() => {
    if (!drawId) return;
    const unsub = subscribeDrawSSE(drawId, (e) => {
      setEvents((prev) => [...prev, e]);

      if (e.type === "block.finalized_all") {
        setBlocksList(e.explorers); // массив SolanaBlock от бэка
      }
      if (e.type === "result") {
        setSeedHex(e.seedHex);
        setResult(e.number);
      }
    });
    return () => unsub();
  }, [drawId]);

  // 2) Потом дергаем POST (один раз)
  useEffect(() => {
    if (!drawId || startedRef.current) return;
    startedRef.current = true;

    if (mode === "solana-blocks") {
      // не await — события придут по SSE
      startSolanaDraw({ draw_id: drawId, blocks: blocksCount }).catch((e) => {
        console.error("start failed", e);
      });
    }
  }, [drawId, mode, blocksCount]);

  const statusChip = useMemo(() => {
    const types = events.map(e => e.type);
    if (types.includes("result")) return <Chip color="success" icon={<CheckCircleIcon />} label="Done" />;
    if (types.includes("mix.start")) return <Chip color="warning" icon={<AutoAwesomeIcon />} label="Mixing..." />;
    if (types.includes("block.finalized_all")) return <Chip color="info" label="Blocks finalized" />;
    if (types.includes("commit")) return <Chip color="default" label="Committed" />;
    return <Chip icon={<HourglassEmptyIcon />} label="Waiting..." />;
  }, [events]);

  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <Stack spacing={3}>
      <Typography variant="h5">Draw: {drawId}</Typography>

      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h6">Status</Typography>
            {statusChip}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Grid container spacing={2}>
            {/* В MUI у дочерних grid обязательно item + xs/md */}
            <Grid item xs={12} md={7}>
              <Typography variant="subtitle1" gutterBottom>Solana blocks</Typography>
              {blocksList.length === 0 ? (
                <Typography variant="body2" color="text.secondary">Ждём финализированные блоки…</Typography>
              ) : (
                <List dense>
                  {blocksList.map((b: SolanaBlock) => (
                    <ListItem
                      key={b.slot}
                      secondaryAction={
                        <Link href={b.explorerUrl} target="_blank" rel="noreferrer">Solscan</Link>
                      }
                    >
                      <ListItemText
                        primary={`slot #${b.slot}`}
                        secondary={<code style={{ fontSize: 12 }}>{b.blockhash}</code>}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Grid>

            <Grid item xs={12} md={5}>
              <Typography variant="subtitle1" gutterBottom>Result</Typography>
              <Card variant="outlined">
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="body2" color="text.secondary">Seed (HKDF)</Typography>
                    <Box sx={{ display:'flex', alignItems:'center', gap:1, wordBreak:'break-all' }}>
                      <code style={{ fontSize: 12 }}>{seedHex ?? "—"}</code>
                      {seedHex && (
                        <Tooltip title="Copy seed">
                          <IconButton size="small" onClick={() => copy(seedHex)}>
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="h4">{result ?? "…"}</Typography>
                  </Stack>
                </CardContent>
              </Card>
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Далее сюда легко добавить вклад других источников (BTC, локальный/квантовый шум)
                  и визуализировать их как отдельные “ингредиенты” перед смешиванием.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>Live log</Typography>
          <List dense>
            {events.map((e, idx) => (
              <ListItem key={idx}>
                <ListItemText
                  primary={e.type}
                  secondary={<code style={{ fontSize: 12 }}>{JSON.stringify(e)}</code>}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Stack>
  );
}
