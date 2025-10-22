// LiveDraw.tsx — MUI v7 (Grid v2), понятная пошаговая визуализация,
// корректная работа с SSE-событиями, включая "error".
// Важно: используем Grid v2 → импорт из '@mui/material/Grid2' и проп size={{ xs: 12 }}

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { startSolanaDraw } from "../lib/api";
import { subscribeDrawSSE } from "../lib/stream";
import type { DrawEvent, SolanaBlock } from "../lib/types";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Tooltip,
  Typography, Grid
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { modNUnbiasedPreview, u64ToDecimalString } from "../lib/big";

// Локальный тип для error-события, чтобы не править общие типы
type ErrorEvent = { type: "error"; drawId: string; stage: string; message: string };
type AnyEvent = DrawEvent | ErrorEvent;

export function LiveDraw() {
  const {drawId = ""} = useParams();
  const loc = useLocation();
  const qs = new URLSearchParams(loc.search);

  const mode = qs.get("mode"); // "solana-blocks"
  const blocksCount = parseInt(qs.get("blocks") || "3", 10);

  const [events, setEvents] = useState<AnyEvent[]>([]);
  const [seedHex, setSeedHex] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [blocksList, setBlocksList] = useState<SolanaBlock[]>([]);
  const [beaconHex, setBeaconHex] = useState<string | null>(null);
  const [trace, setTrace] = useState<{
    beaconHex: string;
    pubComponentHex: string;
    hkdfSaltHex: string;
    seedHex: string;
    chachaFirst16Hex: string;
    u64: string;
    u01: { fraction: { num: string; den: string }; decimal18: string };
  } | null>(null);
  const [lastError, setLastError] = useState<{ stage: string; message: string } | null>(null);

  const [nStr, setNStr] = useState("100"); // демо-диапазон 0..N-1

  const startedRef = useRef(false);

  // 1) Подключаем SSE раньше, чем стартуем генерацию
  useEffect(() => {
    if (!drawId) return;

    const unsub = subscribeDrawSSE(drawId, (e: any) => {
      const ev = e as AnyEvent; // принимаем и стандартные, и error-события
      setEvents((prev) => [...prev, ev]);

      if (ev.type === "block.finalized_all") {
        if (ev.explorers) setBlocksList(ev.explorers as SolanaBlock[]);
        if (ev.beaconHex) setBeaconHex(ev.beaconHex as string);
      }

      if (ev.type === "mix.trace") {
        setTrace({
          beaconHex: ev.beaconHex,
          pubComponentHex: ev.pubComponentHex,
          hkdfSaltHex: ev.hkdfSaltHex,
          seedHex: ev.seedHex,
          chachaFirst16Hex: ev.chachaFirst16Hex,
          u64: ev.u64,
          u01: ev.u01,
        });
        setSeedHex(ev.seedHex);
      }

      if (ev.type === "result") {
        setSeedHex(ev.seedHex);
        setResult(ev.number);
      }

      if (ev.type === "error") {
        const err = ev as ErrorEvent;
        setLastError({stage: err.stage, message: err.message});
        // eslint-disable-next-line no-console
        console.error("RNG error:", err.stage, err.message);
      }
    });

    return () => unsub();
  }, [drawId]);

  // 2) Стартуем один раз после подключения к SSE
  useEffect(() => {
    if (!drawId || startedRef.current) return;
    startedRef.current = true;

    if (mode === "solana-blocks") {
      // Не await — события придут по SSE
      startSolanaDraw({draw_id: drawId, blocks: blocksCount}).catch((e) => {
        // eslint-disable-next-line no-console
        console.error("start failed", e);
      });
    }
  }, [drawId, mode, blocksCount]);

  const statusChip = useMemo(() => {
    const types = events.map((e) => e.type);
    if (types.includes("error"))
      return <Chip color="error" label="Error"/>;
    if (types.includes("result"))
      return <Chip color="success" icon={<CheckCircleIcon/>} label="Done"/>;
    if (types.includes("mix.start"))
      return <Chip color="warning" icon={<AutoAwesomeIcon/>} label="Mixing..."/>;
    if (types.includes("block.finalized_all"))
      return <Chip color="info" label="Blocks finalized"/>;
    if (types.includes("commit"))
      return <Chip color="default" label="Committed"/>;
    return <Chip icon={<HourglassEmptyIcon/>} label="Waiting..."/>;
  }, [events]);

  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
      <Stack spacing={3}>
        <Typography variant="h5">Draw: {drawId}</Typography>

        {lastError && (
            <Alert severity="error">
              Stage: <b>{lastError.stage}</b> — {lastError.message}
            </Alert>
        )}

        <Card variant="outlined">
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h6">Status</Typography>
              {statusChip}
            </Stack>

            <Divider sx={{my: 2}}/>

            <Grid container spacing={2}>
              {/* Левая колонка — блоки Solana + beacon */}
              <Grid size={{xs: 12, md: 7}}>
                <Typography variant="subtitle1" gutterBottom>
                  Solana blocks
                </Typography>
                {blocksList.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      Ждём финализированные блоки…
                    </Typography>
                ) : (
                    <List dense>
                      {blocksList.map((b: SolanaBlock) => (
                          <ListItem
                              key={b.slot}
                              secondaryAction={
                                <Link href={b.explorerUrl} target="_blank" rel="noreferrer">
                                  Solscan
                                </Link>
                              }
                          >
                            <ListItemText
                                primary={`slot #${b.slot}`}
                                secondary={<code style={{fontSize: 12}}>{b.blockhash}</code>}
                            />
                          </ListItem>
                      ))}
                    </List>
                )}

                {beaconHex && (
                    <Box mt={2}>
                      <Typography variant="body2" color="text.secondary">
                        Beacon (конкатенация base58→bytes хэшей блоков)
                      </Typography>
                      <Box sx={{fontFamily: "monospace", fontSize: 12, wordBreak: "break-all"}}>
                        {beaconHex}
                      </Box>
                      <Box sx={{mt: 1}}>
                        <Tooltip title="Copy beacon">
                          <IconButton size="small" onClick={() => beaconHex && copy(beaconHex)}>
                            <ContentCopyIcon fontSize="small"/>
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                )}
              </Grid>

              {/* Правая колонка — итог и сид */}
              <Grid size={{xs: 12, md: 5}}>
                <Typography variant="subtitle1" gutterBottom>
                  Result
                </Typography>
                <Card variant="outlined">
                  <CardContent>
                    <Stack spacing={1}>
                      <Typography variant="body2" color="text.secondary">
                        Seed (HKDF)
                      </Typography>
                      <Box sx={{display: "flex", alignItems: "center", gap: 1, wordBreak: "break-all"}}>
                        <code style={{fontSize: 12}}>{seedHex ?? "—"}</code>
                        {seedHex && (
                            <Tooltip title="Copy seed">
                              <IconButton size="small" onClick={() => copy(seedHex)}>
                                <ContentCopyIcon fontSize="small"/>
                              </IconButton>
                            </Tooltip>
                        )}
                      </Box>
                      <Divider sx={{my: 1}}/>
                      <Typography variant="h4">{result ?? "…"}</Typography>
                    </Stack>
                  </CardContent>
                </Card>
                <Box sx={{mt: 2}}>
                  <Typography variant="body2" color="text.secondary">
                    Далее сюда легко добавить вклад других источников (BTC, локальный/квантовый шум) и визуализировать
                    их как
                    отдельные “ингредиенты” перед смешиванием.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Trace — подробная трассировка с понятными пояснениями */}
        {trace && (
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Как это число получено (простой язык)
                </Typography>
                <Stack spacing={1} sx={{mb: 2}}>
                  <Typography variant="body2">
                    1) <b>Собрали финализированные блоки</b> Solana и сложили их хэши в один большой байтовый буфер
                    (beacon).
                  </Typography>
                  <Typography variant="body2">
                    2) <b>Зафиксировали источник</b>: вычислили доменный хэш <code>H("SOL"‖beacon)</code>, чтобы явно
                    отметить,
                    что это вклад именно Solana-блоков.
                  </Typography>
                  <Typography variant="body2">
                    3) <b>Выполнили HKDF</b> с солью от <code>drawId</code>, получили криптографический <i>seed</i>.
                  </Typography>
                  <Typography variant="body2">
                    4) <b>Запустили ChaCha20</b> от этого seed и взяли первые 8 байт потока как u64 (равномерно от 0 до
                    2⁶⁴−1).
                  </Typography>
                  <Typography variant="body2">
                    5) <b>Нормализация</b>: делим u64 на 2⁶⁴ → получаем число в [0,1) с шагом 2⁻⁶⁴.
                  </Typography>
                </Stack>

                <Stack spacing={1}>
                  <div>
                    <b>beaconHex:</b>{" "}
                    <code style={{fontSize: 12, wordBreak: "break-all"}}>{trace.beaconHex}</code>
                  </div>
                  <div>
                    <b>H("SOL"‖beacon):</b>{" "}
                    <code style={{fontSize: 12, wordBreak: "break-all"}}>{trace.pubComponentHex}</code>
                  </div>
                  <div>
                    <b>HKDF salt:</b>{" "}
                    <code style={{fontSize: 12}}>{trace.hkdfSaltHex}</code>
                  </div>
                  <div>
                    <b>seed:</b>{" "}
                    <code style={{fontSize: 12, wordBreak: "break-all"}}>{trace.seedHex}</code>
                  </div>
                  <div>
                    <b>ChaCha first 16 bytes:</b>{" "}
                    <code style={{fontSize: 12}}>{trace.chachaFirst16Hex}</code>
                  </div>
                  <div>
                    <b>u64:</b>{" "}
                    <code style={{fontSize: 12}}>{trace.u64}</code>
                  </div>
                  <div>
                    <b>u ∈ [0,1) (server):</b>{" "}
                    <code style={{fontSize: 12}}>{trace.u01.decimal18}</code>{" "}
                    <span style={{color: "#666"}}>
                  ({trace.u01.fraction.num}/{trace.u01.fraction.den})
                </span>
                  </div>
                </Stack>
              </CardContent>
            </Card>
        )}

        {/* Interpretation — перевод в [0,1) и 0..N-1 на фронте */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Interpretation
            </Typography>
            {!result ? (
                <Typography variant="body2" color="text.secondary">
                  Ждём результат…
                </Typography>
            ) : (
                <>
                  <Typography variant="body2" gutterBottom>
                    Uniform in [0,1) — client-side (BigInt)
                  </Typography>
                  <Box sx={{fontFamily: "monospace", fontSize: 14}}>
                    {u64ToDecimalString(BigInt(result), 18)}
                    <br/>
                    {`${result}/18446744073709551616`}
                  </Box>

                  <Divider sx={{my: 2}}/>

                  <Typography variant="body2" gutterBottom>
                    Uniform in 0..N-1 (preview)
                  </Typography>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <TextField
                        size="small"
                        label="N"
                        value={nStr}
                        onChange={(e) => setNStr(e.target.value)}
                    />
                    {(() => {
                      let N: bigint;
                      try {
                        N = BigInt(nStr);
                      } catch {
                        N = 0n;
                      }
                      if (N <= 1n)
                        return (
                            <Typography variant="body2" color="text.secondary">
                              Введите N ≥ 2
                            </Typography>
                        );
                      const {value, biased} = modNUnbiasedPreview(BigInt(result), N);
                      return (
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Chip label={`x mod N = ${value.toString()}`}/>
                            {biased && (
                                <Alert severity="warning" sx={{py: 0}}>
                                  Для полной честности нужен rejection (на бэке).
                                </Alert>
                            )}
                          </Stack>
                      );
                    })()}
                  </Stack>
                </>
            )}
          </CardContent>
        </Card>

        {/* Живой лог всех событий */}
        <Card variant="outlined">
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Live log
            </Typography>
          </CardContent>
          <List dense>
            {events.map((e, idx) => (
                <ListItem key={idx}>
                  <ListItemText
                      primary={e.type}
                      secondary={<code style={{fontSize: 12}}>{JSON.stringify(e)}</code>}
                  />
                </ListItem>
            ))}
          </List>
        </Card>
      </Stack>
  );
}
