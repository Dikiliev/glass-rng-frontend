import { useEffect, useState } from "react";
import { getHistory, getHistoryById, type HistoryItem } from "../../lib/api";
import { sampleRangeBySeedLocal } from "../../lib/rangeLocal";
import { Box, Card, CardActionArea, CardContent, Chip, Container, Grid, Stack, Typography, CircularProgress } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function HistoryList() {
    const [items, setItems] = useState<HistoryItem[]>([]);
    useEffect(() => { getHistory().then(r => setItems(r.items)); }, []);

    const [digits, setDigits] = useState<Record<string, number | null>>({});
    useEffect(() => {
        // Подтягиваем seedHex батчем и считаем значение локально без запроса /range/by-seed
        const run = async () => {
            const entries = await Promise.all(items.map(async (it) => {
                try {
                    const rec = await getHistoryById(it.drawId);
                    const seedHex = rec.result?.seedHex;
                    if (!seedHex) return [it.drawId, null] as const;
                    const { value } = sampleRangeBySeedLocal({ seedHex, n1: 0, n2: 9, label: "RANDOM/v1" });
                    return [it.drawId, value] as const;
                } catch {
                    return [it.drawId, null] as const;
                }
            }));
            const map: Record<string, number | null> = {};
            for (const [k, v] of entries) map[k] = v;
            setDigits(map);
        };
        if (items.length) run();
    }, [items]);

    // No fallback to u64%10 — show only correct value from seedHex

    return (
        <Container maxWidth="lg" sx={{ mt: 12, position: 'relative' }}>
            {/* subtle background grid */}
            <Box sx={{
                position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.05,
                backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
                backgroundSize: '24px 24px'
            }} />
            <Stack spacing={1.5} sx={{ position: 'relative' }}>
                <Typography variant="h4" fontWeight={800} sx={{
                    background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                }}>
                    Draw History
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Recent draws with their resulting digit and metadata
                </Typography>
                <Grid container spacing={2}>
                    {items.map(it => {
                        const digit = digits[it.drawId] ?? null;
                        return (
                            <Grid key={it.drawId} size={{ xs: 12, md: 6, lg: 4 }}>
                                <Card variant="outlined" sx={{
                                    position: 'relative',
                                    backgroundColor: 'rgba(255,255,255,0.04)',
                                    borderColor: 'hsl(var(--border))',
                                    backdropFilter: 'blur(6px)',
                                    transition: 'transform 200ms ease, box-shadow 200ms ease, background-color 200ms ease, border-color 200ms ease',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 0 28px hsl(var(--glow-primary) / 0.28)',
                                        backgroundColor: 'rgba(255,255,255,0.06)',
                                        borderColor: 'hsl(var(--foreground) / 0.1)'
                                    }
                                }}>
                                    <CardActionArea component={RouterLink} to={`/history/${it.drawId}`} sx={{ p: 1.5 }}>
                                        <CardContent>
                                            <Stack spacing={1.25}>
                                                {/* Result digit */}
                                                <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                                                    {digit !== null ? (
                                                        <Box sx={{
                                                            fontFamily: 'JetBrains Mono, monospace',
                                                            fontWeight: 800,
                                                            fontSize: { xs: '56px', md: '72px' },
                                                            lineHeight: 1,
                                                            background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--secondary)) 50%, hsl(var(--accent)) 100%)',
                                                            WebkitBackgroundClip: 'text',
                                                            WebkitTextFillColor: 'transparent',
                                                            backgroundClip: 'text',
                                                            textShadow: '0 0 30px hsl(var(--glow-primary) / 0.4)'
                                                        }}>
                                                            {digit}
                                                        </Box>
                                                    ) : (
                                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: { xs: 64, md: 84 }, width: { xs: 64, md: 84 } }}>
                                                            <CircularProgress size={38} thickness={3} sx={{ color: 'hsl(var(--foreground) / 0.9)' }} />
                                                        </Box>
                                                    )}
                                                    <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                                                        {new Date(it.createdAt).toLocaleString()}
                                                    </Typography>
                                                </Box>

                                                {/* Meta */}
                                                <Typography variant="subtitle2" sx={{ color: 'hsl(var(--muted-foreground))' }}>
                                                    {it.drawId}
                                                </Typography>
                                                <Box>
                                                    {it.sources.map(s => (
                                                        <Chip key={s} size="small" label={s} sx={{
                                                            mr: .5,
                                                            color: 'hsl(var(--foreground))',
                                                            backgroundColor: 'hsl(var(--muted))',
                                                            border: '1px solid hsl(var(--border))'
                                                        }} />
                                                    ))}
                                                </Box>
                                                {it.numberU64 && (
                                                    <Typography variant="body2" sx={{ mt: .5, color: 'hsl(var(--muted-foreground))' }}>
                                                        u64: {it.numberU64}
                                                    </Typography>
                                                )}
                                            </Stack>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Stack>
        </Container>
    );
}
