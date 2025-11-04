// src/pages/Home.tsx
import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Collapse,
    Container,
    Divider,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    Stack,
    Switch,
    TextField,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";
import LiveDraw from "./LiveDraw/LiveDraw";
import { subscribeCurrentSSE } from "../lib/stream";
 
 

export default function Home() {
    const nav = useNavigate();

    // Quick start
    const [drawId, setDrawId] = useState(`draw-${Date.now()}`);
    const [blocks, setBlocks] = useState<number>(3);
    const [currentId, setCurrentId] = useState<string | null>(null);

    // Advanced
    const [advOpen, setAdvOpen] = useState(false);
    const [collectMs, setCollectMs] = useState<number>(1200);
    const [requireLoc, setRequireLoc] = useState<boolean>(false);
    const [minLocBytes, setMinLocBytes] = useState<number>(512);

    // History на главной не используется (страница Истории отдельная)

    const presetBlocks = [1, 3, 5, 10, 12];

    // Подписываемся на глобальный SSE-канал текущего drawId (без опроса)
    useEffect(() => {
        const unsub = subscribeCurrentSSE((msg) => {
            // игнорируем служебные события (connected/ping); берём только type==='current'
            if (msg?.drawId) setCurrentId(msg.drawId);
        });
        return () => unsub();
    }, []);

    // Если есть текущий drawId — показываем LiveDraw прямо на главной
    if (currentId) {
        return <LiveDraw key={currentId} drawIdOverride={currentId} />;
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 12, mb: 6, pb: 4 }}>
            {/* HERO */}
            <Box
                sx={(theme) => ({
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    p: { xs: 4, md: 6 },
                    backgroundColor: theme.palette.background.paper,
                    backdropFilter: "blur(20px)",
                    position: "relative",
                    overflow: "hidden",
                    "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "2px",
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                        animation: "shimmer 3s infinite",
                    },
                })}
            >
                <Stack spacing={2}>
                    <Chip icon={<ShieldRoundedIcon />} label="Verifiable RNG — reproducible and transparent" color="default" variant="outlined" sx={{ alignSelf: "start" }} />

                    <Typography 
                        variant="h1" 
                        sx={{ 
                            fontSize: { xs: 32, md: 48 }, 
                            letterSpacing: -0.5,
                            background: "linear-gradient(135deg, #FFFFFF 0%, #FFFFFF 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontWeight: 700,
                        }}
                    >
                        Verifiable draws on public entropy
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800 }}>
                        We take finalized Solana blocks, mix with server noise, derive <code>seed</code> via HKDF,
                        and generate ChaCha20 stream. Every step is visible and reproducible by <code>drawId</code>.
                    </Typography>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="center">
                        <Chip color="success" label={`Server auto-generation every 10 seconds`} />
                        <Button
                            size="large"
                            variant="outlined"
                            startIcon={<HistoryRoundedIcon />}
                            onClick={() => nav("/history")}
                        >
                            History
                        </Button>
                    </Stack>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {/* Quick Start */}
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Stack spacing={2}>
                                        <Typography variant="subtitle1">Quick start</Typography>

                                        <TextField
                                            label="Draw ID"
                                            value={drawId}
                                            onChange={(e) => setDrawId(e.target.value)}
                                            fullWidth
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Tooltip title="Copy">
                                                            <IconButton
                                                                edge="end"
                                                                onClick={() => navigator.clipboard.writeText(drawId)}
                                                                size="small"
                                                            >
                                                                <ContentCopyIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />

                                        <Stack spacing={1}>
                                            <Typography variant="body2" color="text.secondary">Number of finalized Solana blocks</Typography>
                                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1} alignItems="center">
                                                <TextField
                                                    label="Blocks"
                                                    type="number"
                                                    inputProps={{ min: 1, max: 12 }}
                                                    value={blocks}
                                                    onChange={(e) =>
                                                        setBlocks(Math.max(1, Math.min(12, parseInt(e.target.value || "3", 10))))
                                                    }
                                                    sx={{ width: 160 }}
                                                />
                                                <ToggleButtonGroup
                                                    exclusive
                                                    size="small"
                                                    value={String(blocks)}
                                                    onChange={(_, v) => v && setBlocks(parseInt(v, 10))}
                                                >
                                                    {presetBlocks.map((b) => (
                                                        <ToggleButton key={b} value={String(b)} sx={{ px: 1.5 }}>
                                                            {b}
                                                        </ToggleButton>
                                                    ))}
                                                </ToggleButtonGroup>
                                                <Button variant="outlined" onClick={() => setDrawId(`draw-${Date.now()}`)}>New ID</Button>
                                            </Stack>
                                        </Stack>

                                        <Button variant="outlined" color={'secondary'} onClick={() => setAdvOpen((v) => !v)} sx={{ alignSelf: "start" }}>Advanced</Button>

                                        <Collapse in={advOpen} unmountOnExit>
                                            <Stack spacing={2}>
                                                <TextField label="Local noise collection window, ms (collect_ms)" type="number" value={collectMs} onChange={(e) => setCollectMs(parseInt(e.target.value || "0", 10))} sx={{ width: 320 }} helperText="0 — disable collection" />
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Switch
                                                            checked={requireLoc}
                                                            onChange={(e) => setRequireLoc(e.target.checked)}
                                                        />
                                                        <Typography variant="body2">Require local noise</Typography>
                                                    </Stack>
                                                        <TextField label="Min LOC bytes" type="number" value={minLocBytes} onChange={(e) => setMinLocBytes(parseInt(e.target.value || "0", 10))} sx={{ width: 220 }} disabled={!requireLoc} />
                                                </Stack>
                                                <Typography variant="caption" color="text.secondary">Parameters will be added to query and applied on backend.</Typography>
                                            </Stack>
                                        </Collapse>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Why fair */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card variant="outlined" sx={{ height: "100%" }}>
                            <CardHeader title="Why fair" />
                                <CardContent>
                                    <List dense disablePadding>
                                        <ListItem disableGutters sx={{ py: 0.5 }}>
                                            <ListItemText primaryTypographyProps={{ variant: "body2" }} primary="Public entropy: finalized blocks (beacon)" />
                                        </ListItem>
                                        <ListItem disableGutters sx={{ py: 0.5 }}>
                                            <ListItemText primaryTypographyProps={{ variant: "body2" }} primary="HKDF + domain separation via label" />
                                        </ListItem>
                                        <ListItem disableGutters sx={{ py: 0.5 }}>
                                            <ListItemText primaryTypographyProps={{ variant: "body2" }} primary="ChaCha20 → u64 → normalization via rejection" />
                                        </ListItem>
                                    </List>
                                    <Divider sx={{ my: 1.5 }} />
                                    <Typography variant="caption" color="text.secondary">Anyone can reproduce by drawId, beacon, seed, and trace.</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Stack>
            </Box>

            {/* FEATURES */}
            <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <Card variant="outlined" sx={{ backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'divider' }}>
                        <CardHeader title="Live visualization" />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                Events: <b>commit → blocks → mixing → result</b>. Real-time via SSE.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <Card variant="outlined">
                            <CardHeader title="Bitstream tests" />
                        <CardContent>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Download ≥1M bits by seed and run NIST/Dieharder.</Typography>
                            <Button
                                variant="outlined"
                                onClick={() => nav("/history")}
                                startIcon={<ScienceRoundedIcon />}
                            >
                                Pick seed in history
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 12, lg: 4 }}>
                    <Card variant="outlined">
                            <CardHeader title="Ranges and sets" />
                        <CardContent>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Fair mapping into [min..max] and unbiased set sampling (rejection).</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

        </Container>
    );
}
