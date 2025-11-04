import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Box, Card, CardContent, Chip, Container, Divider, Grid, IconButton, Stack,
    Tooltip, Typography, Accordion, AccordionSummary, AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

import { getHistoryById, type HistoryRecord } from "../../lib/api";
import { sampleRangeBySeedLocal } from "../../lib/rangeLocal";

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

function PrettyMono({ children }: { children: React.ReactNode }) {
    return (
        <Box
            sx={{
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                wordBreak: "break-all",
                color: 'hsl(var(--foreground))',
            }}
        >
            {children}
        </Box>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <Typography
            variant="subtitle1"
            sx={{
                color: 'hsl(var(--foreground))',
                fontWeight: 700,
                letterSpacing: 0.2,
            }}
        >
            {children}
        </Typography>
    );
}

/* ───────────────────────────────────────────────────────────────────────────────────────────────── */

export default function HistoryItemPage() {
    const { drawId = "" } = useParams();
    const [rec, setRec] = useState<HistoryRecord | null>(null);

    useEffect(() => {
        if (drawId) getHistoryById(drawId).then(setRec);
    }, [drawId]);

    const u64 = useMemo(() => (rec ? BigInt(rec.result.u64) : 0n), [rec]);
    const u01 = useMemo(() => (rec ? u64ToDecimalString(u64, 18) : "0.0"), [rec, u64]);

    // final digit 0..9 computed locally (same algo as backend /range/by-seed)
    const digit = useMemo(() => {
        if (!rec?.result?.seedHex) return null;
        try {
            const { value } = sampleRangeBySeedLocal({ seedHex: rec.result.seedHex, n1: 0, n2: 9, label: "RANDOM/v1" });
            return value;
        } catch {
            return null;
        }
    }, [rec?.result?.seedHex]);

    // no manual range preview on this page

    if (!rec) return null;

    const chains = Object.keys(rec.sources || {});



    return (
        <Container maxWidth="lg" sx={{ mt: 12, mb: 6, position: 'relative' }}>
            {/* subtle background */}
            <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.05,
                backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`, backgroundSize: '24px 24px' }} />
            <Stack spacing={3} sx={{ position: 'relative' }}>
                {/* Header / Overview */}
                <Stack spacing={0.5}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h4" fontWeight={800} sx={{
                            background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
                        }}>Draw</Typography>
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
                            {(rec.inputs || []).map(s => (
                                <Chip
                                    key={s}
                                    size="small"
                                    label={`src:${s}`}
                                    sx={{
                                        mr: .5,
                                        color: 'hsl(var(--foreground))',
                                        backgroundColor: 'hsl(var(--muted))',
                                        border: '1px solid hsl(var(--border))',
                                    }}
                                />
                            ))}
                        </Stack>
                    </Stack>
                </Stack>

                {/* Summary card */}
                <Card variant="outlined" sx={{
                    backgroundColor: 'rgba(255,255,255,0.04)', borderColor: 'hsl(var(--border))', backdropFilter: 'blur(6px)'
                }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 12 }} spacing={2}>
                                <SectionTitle>Result</SectionTitle>
                                <Card variant="outlined" sx={{ my: 2, backgroundColor: 'rgba(255,255,255,0.03)' }}>
                                    <CardContent>
                                        <Typography variant="body2" color="text.secondary">Seed (HKDF)</Typography>
                                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: .5 }}>
                                            <PrettyMono>{rec.result.seedHex}</PrettyMono>
                                            <Tooltip title="Copy seed"><IconButton size="small" onClick={() => copy(rec.result.seedHex)}><ContentCopyIcon fontSize="small" /></IconButton></Tooltip>
                                        </Stack>
                                        <Divider sx={{ my: 1 }} />
                                        {/* Final digit (0..9) */}
                                        <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                                            <Box sx={{
                                                fontFamily: 'JetBrains Mono, monospace', fontWeight: 900,
                                                fontSize: { xs: '72px', md: '96px' }, lineHeight: 1,
                                                background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 50%, hsl(var(--accent)) 100%)',
                                                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                                                textShadow: '0 0 40px hsl(var(--glow-primary) / 0.45)'
                                            }}>
                                                {digit !== null ? digit : '—'}
                                            </Box>
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="body2" color="text.secondary">u64 ∈ 0..2^64−1</Typography>
                                                <Typography variant="body2" sx={{ mt: .5 }}>u ∈ [0,1): <PrettyMono>{u01}</PrettyMono></Typography>
                                            </Box>
                                        </Box>
                                    </CardContent>
                                </Card>
                                {/* No manual generation controls on this page */}
                            </Grid>

                            <Grid size={{ xs: 12, md: 5 }}>
                                <SectionTitle>Quick facts</SectionTitle>
                                <Card
                                    variant="outlined"
                                    sx={{
                                        backgroundColor: 'rgba(255,255,255,0.06)',
                                        borderColor: 'hsl(var(--border))',
                                        color: 'hsl(var(--foreground))',
                                    }}
                                >
                                    <CardContent>
                                        <Stack spacing={1}>
                                            <Row label="Date">
                                                {new Date(rec.createdAt).toLocaleString()}
                                            </Row>
                                            <Row label="Sources">
                                                {(rec.inputs || []).map(s => (
                                                    <Chip
                                                        key={s}
                                                        size="small"
                                                        label={`src:${s}`}
                                                        sx={{
                                                            mr: .5,
                                                            color: 'hsl(var(--foreground))',
                                                            backgroundColor: 'hsl(var(--muted))',
                                                            border: '1px solid hsl(var(--border))',
                                                        }}
                                                    />
                                                ))}
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

                {/* Collapsible sections */}

                {/* Block sources */}
                <Accordion
                    sx={{
                        borderRadius: 2,
                        backgroundColor: 'rgba(255,255,255,0.06)',
                        border: '1px solid hsl(var(--border))',
                        color: 'hsl(var(--foreground))',
                        '&:before': { display: 'none' },
                        '& .MuiAccordionSummary-root': {
                            backgroundColor: 'transparent',
                        },
                        '& .MuiAccordionDetails-root': {
                            backgroundColor: 'transparent',
                        },
                    }}
                    defaultExpanded={false}
                >
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'text.primary' }} />}>
                        <Typography fontWeight={600}>Block sources</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {chains.length === 0 ? (
                            <Typography color="text.secondary">No public sources in this record.</Typography>
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

                {/* Trace */}
                {rec.trace && (
                    <Accordion
                        sx={{
                            borderRadius: 2,
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            border: '1px solid hsl(var(--border))',
                            color: 'hsl(var(--foreground))',
                            '&:before': { display: 'none' },
                            '& .MuiAccordionSummary-root': { backgroundColor: 'transparent' },
                            '& .MuiAccordionDetails-root': { backgroundColor: 'transparent' },
                        }}
                        defaultExpanded={false}
                    >
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'text.primary' }} />}>
                            <Typography fontWeight={600}>How the number is derived — step by step</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack spacing={1} sx={{ mb: 2 }}>
                                <Typography variant="body2">1) Source hashing: H("SOL"‖beacon)</Typography>
                                <Typography variant="body2">2) HKDF with salt from drawId → seed</Typography>
                                <Typography variant="body2">3) ChaCha20(seed) → first 8 bytes = u64</Typography>
                                <Typography variant="body2">4) Normalization: u64 / 2^64 → [0,1)</Typography>
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

                {/* Comparison PUB vs PUB+LOC */}
                {rec.compare && (
                    <Accordion
                        sx={{
                            borderRadius: 2,
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            border: '1px solid hsl(var(--border))',
                            color: 'hsl(var(--foreground))',
                            '&:before': { display: 'none' },
                            '& .MuiAccordionSummary-root': { backgroundColor: 'transparent' },
                            '& .MuiAccordionDetails-root': { backgroundColor: 'transparent' },
                        }}
                        defaultExpanded={false}
                    >
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'text.primary' }} />}>
                            <Typography fontWeight={600}>Noise impact (comparison)</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <SectionTitle>PUB only</SectionTitle>
                                    <Card variant="outlined" sx={{
                                        backgroundColor: 'rgba(255,255,255,0.06)',
                                        borderColor: 'hsl(var(--border))',
                                        color: 'hsl(var(--foreground))',
                                    }}>
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
                                    <Card variant="outlined" sx={{
                                        backgroundColor: 'rgba(255,255,255,0.06)',
        borderColor: 'hsl(var(--border))',
        color: 'hsl(var(--foreground))',
                                    }}>
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

                {/* Server noise */}
                {(rec.entropy?.locRoot) && (
                    <Accordion
                        sx={{
                            borderRadius: 2,
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            border: '1px solid hsl(var(--border))',
                            color: 'hsl(var(--foreground))',
                            '&:before': { display: 'none' },
                            '& .MuiAccordionSummary-root': { backgroundColor: 'transparent' },
                            '& .MuiAccordionDetails-root': { backgroundColor: 'transparent' },
                        }}
                        defaultExpanded={false}
                    >
                    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'text.primary' }} />}>
                            <Typography fontWeight={600}>Server noise</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Row label="LOC root"><PrettyMono>{rec.entropy.locRoot}</PrettyMono></Row>
                            {rec.entropy.summary && (
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="body2" color="text.secondary">Summary:</Typography>
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
            </Stack>
        </Container>
    );
}

/* ───────────────────── small layout helper ───────────────────── */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <Stack direction="row" spacing={1} sx={{ alignItems: "baseline" }}>
            <Typography variant="body2" sx={{ width: 160, color: 'hsl(var(--muted-foreground))' }}>{label}</Typography>
            <Box sx={{ flex: 1 }}>{children}</Box>
        </Stack>
    );
}
