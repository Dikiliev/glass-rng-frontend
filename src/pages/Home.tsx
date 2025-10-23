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
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Skeleton,
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
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import ScienceRoundedIcon from "@mui/icons-material/ScienceRounded";
import ShuffleRoundedIcon from "@mui/icons-material/ShuffleRounded";
import ShieldRoundedIcon from "@mui/icons-material/ShieldRounded";

type HistoryItem = {
    drawId: string;
    createdAt?: string;
    number?: number;
    result?: { number?: number; seedHex?: string };
};

export default function Home() {
    const nav = useNavigate();

    // Quick start
    const [drawId, setDrawId] = useState(`draw-${Date.now()}`);
    const [blocks, setBlocks] = useState<number>(3);
    const [loading, setLoading] = useState(false);

    // Advanced
    const [advOpen, setAdvOpen] = useState(false);
    const [collectMs, setCollectMs] = useState<number>(1200);
    const [requireLoc, setRequireLoc] = useState<boolean>(false);
    const [minLocBytes, setMinLocBytes] = useState<number>(512);

    // History
    const [history, setHistory] = useState<HistoryItem[] | null>(null);
    const [histLoading, setHistLoading] = useState<boolean>(true);

    useEffect(() => {
        let cancelled = false;
        (async () => {
            try {
                setHistLoading(true);
                const resp = await fetch("/history");
                const data = await resp.json();
                if (!cancelled) {
                    const list: HistoryItem[] = Array.isArray(data) ? data : data?.items ?? [];
                    setHistory(list.slice(0, 8));
                }
            } catch {
                if (!cancelled) setHistory([]);
            } finally {
                if (!cancelled) setHistLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const canStart =
        drawId.trim().length > 0 &&
        Number.isFinite(blocks) &&
        blocks >= 1 &&
        blocks <= 12 &&
        Number.isFinite(collectMs) &&
        collectMs >= 0 &&
        (!requireLoc || minLocBytes >= 1);

    const onStart = () => {
        setLoading(true);
        const params = new URLSearchParams();
        params.set("mode", "solana-blocks");
        params.set("blocks", String(blocks));
        if (collectMs !== 1200) params.set("collect_ms", String(collectMs));
        if (requireLoc) params.set("require_loc", "true");
        if (requireLoc && minLocBytes > 0) params.set("min_loc_bytes", String(minLocBytes));
        nav(`/draw/${encodeURIComponent(drawId)}?${params.toString()}`);
        setLoading(false);
    };

    const presetBlocks = [1, 3, 5, 10, 12];

    return (
        <Container sx={{ my: { xs: 4, md: 6 }, pb: 4 }}>
            {/* HERO */}
            <Box
                sx={(theme) => ({
                    border: `1px solid ${theme.palette.divider}`,
                    borderRadius: 3,
                    p: { xs: 3, md: 5 },
                    backgroundColor: theme.palette.background.paper,
                })}
            >
                <Stack spacing={2}>
                    <Chip
                        icon={<ShieldRoundedIcon />}
                        label="Проверяемый ГСЧ — воспроизводимо и прозрачно"
                        color="default"
                        variant="outlined"
                        sx={{ alignSelf: "start" }}
                    />

                    <Typography variant="h1" sx={{ fontSize: { xs: 28, md: 36 }, letterSpacing: -0.2 }}>
                        Честные тиражи на публичной энтропии
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800 }}>
                        Берём финализированные блоки Solana, смешиваем с локальным шумом, получаем <code>seed</code> через HKDF
                        и генерируем поток ChaCha20. Каждый шаг — видим и воспроизводим по <code>drawId</code>.
                    </Typography>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="center">
                        <Button
                            size="large"
                            variant="contained"
                            startIcon={<PlayArrowRoundedIcon />}
                            onClick={onStart}
                            disabled={!canStart || loading}
                        >
                            {loading ? "Запуск…" : "Start & Watch"}
                        </Button>
                        <Button
                            size="large"
                            variant="outlined"
                            startIcon={<HistoryRoundedIcon />}
                            onClick={() => nav("/history")}
                        >
                            История
                        </Button>
                    </Stack>

                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        {/* Quick Start */}
                        <Grid size={{ xs: 12, md: 8 }}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Stack spacing={2}>
                                        <Typography variant="subtitle1">Быстрый старт</Typography>

                                        <TextField
                                            label="Draw ID"
                                            value={drawId}
                                            onChange={(e) => setDrawId(e.target.value)}
                                            fullWidth
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Tooltip title="Скопировать">
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
                                            <Typography variant="body2" color="text.secondary">
                                                Кол-во финализированных блоков Solana
                                            </Typography>
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
                                                <Button variant="outlined" onClick={() => setDrawId(`draw-${Date.now()}`)}>
                                                    Новый ID
                                                </Button>
                                            </Stack>
                                        </Stack>

                                        <Button
                                            variant="outlined"
                                            color={'secondary'}
                                            onClick={() => setAdvOpen((v) => !v)}
                                            sx={{ alignSelf: "start" }}
                                        >
                                            Advanced
                                        </Button>

                                        <Collapse in={advOpen} unmountOnExit>
                                            <Stack spacing={2}>
                                                <TextField
                                                    label="Окно сбора локального шума, ms (collect_ms)"
                                                    type="number"
                                                    value={collectMs}
                                                    onChange={(e) => setCollectMs(parseInt(e.target.value || "0", 10))}
                                                    sx={{ width: 320 }}
                                                    helperText="0 — отключить сбор"
                                                />
                                                <Stack direction="row" spacing={2} alignItems="center">
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <Switch
                                                            checked={requireLoc}
                                                            onChange={(e) => setRequireLoc(e.target.checked)}
                                                        />
                                                        <Typography variant="body2">Требовать локальный шум</Typography>
                                                    </Stack>
                                                    <TextField
                                                        label="Мин. LOC bytes"
                                                        type="number"
                                                        value={minLocBytes}
                                                        onChange={(e) => setMinLocBytes(parseInt(e.target.value || "0", 10))}
                                                        sx={{ width: 220 }}
                                                        disabled={!requireLoc}
                                                    />
                                                </Stack>
                                                <Typography variant="caption" color="text.secondary">
                                                    Параметры добавятся в query и будут учтены бэкендом.
                                                </Typography>
                                            </Stack>
                                        </Collapse>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Why fair */}
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card variant="outlined" sx={{ height: "100%" }}>
                                <CardHeader title="Почему это честно" />
                                <CardContent>
                                    <List dense disablePadding>
                                        <ListItem disableGutters sx={{ py: 0.5 }}>
                                            <ListItemText
                                                primaryTypographyProps={{ variant: "body2" }}
                                                primary="Публичная энтропия: финализированные блоки (beacon)"
                                            />
                                        </ListItem>
                                        <ListItem disableGutters sx={{ py: 0.5 }}>
                                            <ListItemText
                                                primaryTypographyProps={{ variant: "body2" }}
                                                primary="HKDF + domain separation через label"
                                            />
                                        </ListItem>
                                        <ListItem disableGutters sx={{ py: 0.5 }}>
                                            <ListItemText
                                                primaryTypographyProps={{ variant: "body2" }}
                                                primary="ChaCha20 → u64 → нормализация через rejection"
                                            />
                                        </ListItem>
                                    </List>
                                    <Divider sx={{ my: 1.5 }} />
                                    <Typography variant="caption" color="text.secondary">
                                        Любой может воспроизвести расчёт по drawId, beacon, seed и трассировке.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Stack>
            </Box>

            {/* FEATURES */}
            <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <Card variant="outlined">
                        <CardHeader title="Live-визуализация" />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary">
                                События: <b>commit → blocks → mixing → result</b>. Всё в реальном времени через SSE.
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                    <Card variant="outlined">
                        <CardHeader title="Битовые тесты" />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Скачай ≥1M бит по seed и запусти NIST/Dieharder.
                            </Typography>
                            <Button
                                variant="outlined"
                                onClick={() => nav("/history")}
                                startIcon={<ScienceRoundedIcon />}
                            >
                                Выбрать seed в истории
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 12, lg: 4 }}>
                    <Card variant="outlined">
                        <CardHeader title="Диапазоны и наборы" />
                        <CardContent>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Честная интерпретация в [min..max] и генерация наборов без смещения (rejection).
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

        </Container>
    );
}
