import { useEffect, useMemo, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
    Box, Button, Card, CardContent, Chip, Container, Divider, Grid, IconButton, Stack,
    Tooltip, Typography, Accordion, AccordionSummary, AccordionDetails, TextField, MenuItem
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";

import { getHistoryById, type HistoryRecord } from "../../lib/api";
import { api } from "../../lib/http";
import {MultiSamplePanel} from "../LiveDraw/components/MultiSamplePanel.tsx";

/* ───────────────────── helpers (локально, чтоб не тянуть лишние зависимости) ───────────────────── */

function copy(text: string) {
    navigator.clipboard.writeText(text);
}

function u64ToDecimalString(u64: bigint, decimals = 18): string {
    const TWO64 = 1n << 64n;
    const scale = 10n ** BigInt(decimals);
    const scaled = (u64 * scale) / TWO64;
    const s = scaled.toString().padStart(decimals + 1, "0");
    const head = s.slice(0, -decimals);
    const tail = s.slice(-decimals);
    return `${head}.${tail}`.replace(/^0+(?=\d)/, (m) => (m.length ? "0" : ""));
}

function modNUnbiasedPreview(x: bigint, N: bigint) {
    const TWO64 = 1n << 64n;
    if (N <= 1n) return { value: 0n, biased: true, reject: true };
    const t = TWO64 - (TWO64 % N);
    if (x < t) {
        return { value: x % N, biased: false, reject: false };
    }
    // для честного результата нужен пересэмплинг (в истории у нас один u64)
    return { value: x % N, biased: true, reject: true };
}

function PrettyMono({ children }: { children: React.ReactNode }) {
    return <Box sx={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", wordBreak: "break-all" }}>{children}</Box>;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <Typography variant="subtitle1" sx={{ color: "text.secondary", fontWeight: 600 }}>
            {children}
        </Typography>
    );
}

/* ───────────────────────────────────────────────────────────────────────────────────────────────── */

export default function HistoryItemPage() {
    const { drawId = "" } = useParams();
    const [rec, setRec] = useState<HistoryRecord | null>(null);

    // для выгрузки битов
    const [bits, setBits] = useState<string>("1000000");
    const [fmt, setFmt] = useState<"txt" | "bin">("txt");
    const [sep, setSep] = useState<"none" | "newline">("none");

    useEffect(() => {
        if (drawId) getHistoryById(drawId).then(setRec);
    }, [drawId]);

    const u64 = useMemo(() => (rec ? BigInt(rec.result.u64) : 0n), [rec]);
    const u01 = useMemo(() => (rec ? u64ToDecimalString(u64, 18) : "0.0"), [rec, u64]);

    // для «число в диапазоне»
    const [nMin, setNMin] = useState<string>("1");
    const [nMax, setNMax] = useState<string>("100");
    const rangePreview = useMemo(() => {
        try {
            const a = BigInt(nMin);
            const b = BigInt(nMax);
            if (b <= a) return { text: "Введите корректный диапазон: min < max", warn: true };
            const N = b - a + 1n;
            const { value, biased, reject } = modNUnbiasedPreview(u64, N);
            const mapped = a + value;
            if (reject) {
                return {
                    text: `Предпросмотр: ${mapped.toString()} (bias possible: нужен пересэмплинг для полной честности)`,
                    warn: true,
                };
            }
            return { text: `x ∈ [${a}, ${b}]: ${mapped.toString()} (unbiased)`, warn: false };
        } catch {
            return { text: "Введите числа (целые)", warn: true };
        }
    }, [nMin, nMax, u64]);

    if (!rec) return null;

    const chains = Object.keys(rec.sources || {});



    async function downloadBits() {
        const url = "/tests/bitstream/by-seed";
        const body = { seed_hex: rec.result.seedHex, bits: Number(bits), fmt, sep };
        const response = await api.post(url, body, { responseType: "blob" });
        const blob = new Blob([response.data], { type: fmt === "txt" ? "text/plain" : "application/octet-stream" });
        const filename = `bits_${bits}_${fmt}.${fmt === "txt" ? "txt" : "bin"}`;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
    }

    return (
        <Container sx={{ mt: 6, mb: 6 }}>
            <Stack spacing={3}>
                {/* ───────── Header / Overview ───────── */}
                <Stack spacing={0.5}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h4" fontWeight={700}>Тираж</Typography>
                        <Chip label="saved" size="small" />
                        <Box sx={{ flex: 1 }} />
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems={{ xs: "flex-start", sm: "center" }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="overline" color="text.secondary">ID:</Typography>
                            <Box sx={{ fontFamily: "inherit", fontSize: 14 }}>{rec.drawId}</Box>
                            <Tooltip title="Copy draw id">
                                <IconButton size="small" onClick={() => copy(rec.drawId)}><ContentCopyIcon fontSize="small" /></IconButton>
                            </Tooltip>
                        </Stack>
                        <Box sx={{ flex: 1 }} />
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            {(rec.inputs || []).map(s => <Chip key={s} size="small" label={`src:${s}`} />)}
                        </Stack>
                    </Stack>
                </Stack>

                {/* ───────── Summary card ───────── */}
                <Card variant="outlined">
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 12 }} spacing={2}>
                                <SectionTitle>Основной результат</SectionTitle>
                                <Card variant="outlined" sx={{ my: 2 }}>
                                    <CardContent>
                                        <Typography variant="body2" color="text.secondary">Seed (HKDF)</Typography>
                                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: .5 }}>
                                            <PrettyMono>{rec.result.seedHex}</PrettyMono>
                                            <Tooltip title="Copy seed"><IconButton size="small" onClick={() => copy(rec.result.seedHex)}><ContentCopyIcon fontSize="small" /></IconButton></Tooltip>
                                        </Stack>
                                        <Divider sx={{ my: 1 }} />
                                        <Typography variant="h4">{rec.result.u64}</Typography>
                                        <Typography variant="body2" color="text.secondary">u64 ∈ 0..2^64−1</Typography>
                                        <Typography variant="body2" sx={{ mt: .5 }}>u ∈ [0,1): <PrettyMono>{u01}</PrettyMono></Typography>
                                    </CardContent>
                                </Card>

                                {/* Интерпретация: число в диапазоне */}
                                <SectionTitle>Число в диапазоне</SectionTitle>
                                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ my: 1 }}>
                                    <TextField
                                        size="small"
                                        label="min"
                                        value={nMin}
                                        onChange={(e) => setNMin(e.target.value)}
                                        sx={{ maxWidth: 180 }}
                                    />
                                    <TextField
                                        size="small"
                                        label="max"
                                        value={nMax}
                                        onChange={(e) => setNMax(e.target.value)}
                                        sx={{ maxWidth: 180 }}
                                    />
                                    <Box sx={{ alignSelf: "center", color: rangePreview.warn ? "warning.main" : "text.secondary" }}>
                                        {rangePreview.text}
                                    </Box>
                                </Stack>

                                {rec.result.seedHex && <MultiSamplePanel seedHex={rec.result.seedHex} drawId={drawId} />}
                            </Grid>

                            <Grid size={{ xs: 12, md: 5 }}>
                                <SectionTitle>Быстрые факты</SectionTitle>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Stack spacing={1}>
                                            <Row label="Дата">
                                                {new Date(rec.createdAt).toLocaleString()}
                                            </Row>
                                            <Row label="Источники">
                                                {(rec.inputs || []).map(s => <Chip key={s} size="small" label={`src:${s}`} sx={{ mr: .5 }} />)}
                                            </Row>
                                            {rec.entropy?.locRoot && (
                                                <Row label="LOC root">
                                                    <PrettyMono>{rec.entropy.locRoot}</PrettyMono>
                                                </Row>
                                            )}
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* ───────── Секции со сворачиванием (минимум шума по умолчанию) ───────── */}

                {/* Источники блоков */}
                <Accordion sx={{ borderRadius: 2 }} defaultExpanded={false}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography fontWeight={600}>Источники блоков</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {chains.length === 0 ? (
                            <Typography color="text.secondary">Нет публичных источников в записи.</Typography>
                        ) : (
                            chains.map((chain) => (
                                <Box key={chain} sx={{ mb: 2 }}>
                                    <Typography variant="body2" fontWeight={600} sx={{ mb: .5 }}>{chain}</Typography>
                                    {rec.sources[chain].beaconHex && (
                                        <Box sx={{ mb: 1 }}>
                                            <Typography variant="caption" color="text.secondary">Beacon</Typography>
                                            <PrettyMono>{rec.sources[chain].beaconHex}</PrettyMono>
                                        </Box>
                                    )}
                                    {(rec.sources[chain].blocks || []).map((b: any, i: number) => (
                                        <Box key={i} sx={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, opacity: .85 }}>
                                            {(b.slot && `slot #${b.slot}`) ||
                                                (b.number && `block #${b.number}`) ||
                                                (b.height && `height #${b.height}`)} — {b.blockhash}
                                            {b.explorerUrl && (
                                                <Box component="a" href={b.explorerUrl} target="_blank" rel="noreferrer" sx={{ ml: 1 }}>
                                                    (explorer)
                                                </Box>
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            ))
                        )}
                    </AccordionDetails>
                </Accordion>

                {/* Трассировка */}
                {rec.trace && (
                    <Accordion sx={{ borderRadius: 2 }} defaultExpanded={false}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography fontWeight={600}>Как получено число — шаг за шагом</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={1} sx={{ mb: 2 }}>
                                <Typography variant="body2">1) Домашинг источника: H("SOL"‖beacon)</Typography>
                                <Typography variant="body2">2) HKDF с солью от drawId → seed</Typography>
                                <Typography variant="body2">3) ChaCha20(seed) → первые 8 байт = u64</Typography>
                                <Typography variant="body2">4) Нормализация: u64 / 2^64 → [0,1)</Typography>
                            </Stack>
                            <Stack spacing={1}>
                                <Row label='beaconHex'><PrettyMono>{rec.trace.beaconHex}</PrettyMono></Row>
                                <Row label='H("SOL"‖beacon)'><PrettyMono>{rec.trace.pubComponentHex}</PrettyMono></Row>
                                <Row label='HKDF salt'><PrettyMono>{rec.trace.hkdfSaltHex}</PrettyMono></Row>
                                <Row label='seed'><PrettyMono>{rec.trace.seedHex}</PrettyMono></Row>
                                <Row label='ChaCha first 16B'><PrettyMono>{rec.trace.chachaFirst16Hex}</PrettyMono></Row>
                                <Row label='u64'><PrettyMono>{rec.trace.u64}</PrettyMono></Row>
                                <Row label='u ∈ [0,1) (server)'>
                                    <PrettyMono>{rec.trace.u01?.decimal18}</PrettyMono>
                                </Row>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                )}

                {/* Сравнение PUB vs PUB+LOC */}
                {rec.compare && (
                    <Accordion sx={{ borderRadius: 2 }} defaultExpanded={false}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography fontWeight={600}>Влияние шума (сравнение)</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <SectionTitle>PUB только</SectionTitle>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Row label="seed"><PrettyMono>{rec.compare.pub.seedHex}</PrettyMono></Row>
                                            <Row label="ChaCha first 16B"><PrettyMono>{rec.compare.pub.chachaFirst16Hex}</PrettyMono></Row>
                                            <Row label="u64"><PrettyMono>{rec.compare.pub.u64}</PrettyMono></Row>
                                            <Row label="u"><PrettyMono>{rec.compare.pub.u01?.decimal18}</PrettyMono></Row>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <SectionTitle>PUB + LOC</SectionTitle>
                                    <Card variant="outlined">
                                        <CardContent>
                                            <Row label="seed"><PrettyMono>{rec.compare.pub_loc.seedHex}</PrettyMono></Row>
                                            <Row label="ChaCha first 16B"><PrettyMono>{rec.compare.pub_loc.chachaFirst16Hex}</PrettyMono></Row>
                                            <Row label="u64"><PrettyMono>{rec.compare.pub_loc.u64}</PrettyMono></Row>
                                            <Row label="u"><PrettyMono>{rec.compare.pub_loc.u01?.decimal18}</PrettyMono></Row>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                )}

                {/* Серверный шум */}
                {(rec.entropy?.locRoot) && (
                    <Accordion sx={{ borderRadius: 2 }} defaultExpanded={false}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography fontWeight={600}>Серверный шум</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Row label="LOC root"><PrettyMono>{rec.entropy.locRoot}</PrettyMono></Row>
                            {rec.entropy.summary && (
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary">Суммарно:</Typography>
                                    <Stack direction="row" spacing={1} sx={{ mt: .5 }} flexWrap="wrap">
                                        {"urandomBytes" in rec.entropy.summary && <Chip size="small" label={`urandom: ${rec.entropy.summary.urandomBytes}`} />}
                                        {"jitterBatches" in rec.entropy.summary && <Chip size="small" label={`jitter batches: ${rec.entropy.summary.jitterBatches}`} />}
                                        {"jitterBytes" in rec.entropy.summary && <Chip size="small" label={`jitter bytes: ${rec.entropy.summary.jitterBytes}`} />}
                                        {"jitterSamplesTotal" in rec.entropy.summary && <Chip size="small" label={`jitter samples: ${rec.entropy.summary.jitterSamplesTotal}`} />}
                                    </Stack>
                                </Box>
                            )}
                        </AccordionDetails>
                    </Accordion>
                )}

                {/* Выгрузка бит для NIST/Dieharder */}
                <Accordion sx={{ borderRadius: 2 }} defaultExpanded={false}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography fontWeight={600}>Проверка качества: выгрузка бит</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            Генерируем поток бит на основе сохранённого seed. Подходит для NIST STS / Dieharder / TestU01.
                        </Typography>
                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
                            <TextField
                                size="small"
                                label="Количество бит"
                                value={bits}
                                onChange={(e) => setBits(e.target.value)}
                                sx={{ maxWidth: 200 }}
                            />
                            <TextField
                                select
                                size="small"
                                label="Формат"
                                value={fmt}
                                onChange={(e) => setFmt(e.target.value as "txt" | "bin")}
                                sx={{ maxWidth: 180 }}
                            >
                                <MenuItem value="txt">Текст (ASCII 0/1)</MenuItem>
                                <MenuItem value="bin">Бинарный</MenuItem>
                            </TextField>
                            {fmt === "txt" && (
                                <TextField
                                    select
                                    size="small"
                                    label="Сепаратор"
                                    value={sep}
                                    onChange={(e) => setSep(e.target.value as "none" | "newline")}
                                    sx={{ maxWidth: 200 }}
                                >
                                    <MenuItem value="none">Без разделителей</MenuItem>
                                    <MenuItem value="newline">Каждый бит с новой строки</MenuItem>
                                </TextField>
                            )}
                            <Button variant="contained" startIcon={<DownloadIcon />} onClick={downloadBits}>
                                Скачать
                            </Button>
                        </Stack>
                        <Box sx={{ mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                                Рекомендация: для NIST STS — не меньше 1,000,000 бит.
                            </Typography>
                        </Box>
                    </AccordionDetails>
                </Accordion>
            </Stack>
        </Container>
    );
}

/* ───────────────────── small layout helper ───────────────────── */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <Stack direction="row" spacing={1} sx={{ alignItems: "baseline" }}>
            <Typography variant="body2" sx={{ width: 160, color: "text.secondary" }}>{label}</Typography>
            <Box sx={{ flex: 1 }}>{children}</Box>
        </Stack>
    );
}
