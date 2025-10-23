import { useEffect, useState } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import { getHistoryById, type HistoryRecord } from "../../lib/api";
import { Box, Card, CardContent, Chip, Container, Grid, IconButton, Stack, Tooltip, Typography, Divider, Button } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

export default function HistoryItemPage() {
    const { drawId = "" } = useParams();
    const [rec, setRec] = useState<HistoryRecord | null>(null);

    useEffect(() => { if (drawId) getHistoryById(drawId).then(setRec); }, [drawId]);

    if (!rec) return null;

    const copy = (t:string) => navigator.clipboard.writeText(t);
    const chains = Object.keys(rec.sources || {});
    const hasSOL = !!rec.sources?.SOL;

    return (
        <Container sx={{ mt: 6 }}>
            <Stack spacing={3}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h4" fontWeight={700}>Тираж</Typography>
                    <Chip label="saved" size="small" />
                    <Box sx={{ flex:1 }} />
                    <Button component={RouterLink} to={`/draw/${drawId}?mode=solana-blocks`} variant="outlined" size="small">Открыть Live</Button>
                </Stack>

                <Card variant="outlined">
                    <CardContent>
                        <Stack spacing={1}>
                            <Typography variant="h6">{rec.drawId}</Typography>
                            <Typography variant="body2" color="text.secondary">{new Date(rec.createdAt).toLocaleString()}</Typography>
                            <Box>
                                {rec.inputs?.map(s => <Chip key={s} size="small" label={`src:${s}`} sx={{ mr:.5 }} />)}
                            </Box>
                        </Stack>
                        <Divider sx={{ my:2 }} />

                        <Grid container spacing={2}>
                            <Grid size={{ xs:12, md:7 }}>
                                <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>Источники блоков</Typography>
                                {chains.length === 0 ? (
                                    <Typography color="text.secondary">Нет публичных источников в записи.</Typography>
                                ) : chains.map(chain => (
                                    <Box key={chain} sx={{ mt:1.5 }}>
                                        <Typography variant="body2" fontWeight={600}>{chain}</Typography>
                                        <Box sx={{ fontFamily:"monospace", fontSize:12, wordBreak:"break-all" }}>
                                            <b>Beacon:</b> {rec.sources[chain].beaconHex}
                                        </Box>
                                        {(rec.sources[chain].blocks||[]).slice(0,6).map((b:any, i:number) => (
                                            <Box key={i} sx={{ fontFamily:"monospace", fontSize:12, opacity:.8 }}>
                                                {(b.slot && `slot #${b.slot}`) || (b.number && `block #${b.number}`) || (b.height && `height #${b.height}`)} — {b.blockhash}
                                            </Box>
                                        ))}
                                    </Box>
                                ))}
                            </Grid>

                            <Grid size={{ xs:12, md:5 }}>
                                <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>Результат</Typography>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="body2" color="text.secondary">Seed (HKDF)</Typography>
                                        <Box sx={{ display:"flex", gap:1, fontFamily:"monospace", fontSize:12, wordBreak:"break-all" }}>
                                            {rec.result.seedHex}
                                            <Tooltip title="Copy seed"><IconButton size="small" onClick={()=>copy(rec.result.seedHex)}><ContentCopyIcon fontSize="small"/></IconButton></Tooltip>
                                        </Box>
                                        <Divider sx={{ my:1 }} />
                                        <Typography variant="h4">{rec.result.u64}</Typography>
                                        <Typography variant="body2" color="text.secondary">u64 ∈ 0..2^64−1</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {rec.entropy?.locRoot && (
                    <Card variant="outlined">
                        <CardContent>
                            <Typography variant="subtitle1" color="text.secondary" fontWeight={600}>Серверная энтропия</Typography>
                            <Box sx={{ fontFamily:"monospace", fontSize:12, wordBreak:"break-all" }}>
                                LOC root: {rec.entropy.locRoot}
                            </Box>
                        </CardContent>
                    </Card>
                )}
            </Stack>
        </Container>
    );
}
