// src/pages/LiveDraw/LiveDraw.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
    Box,
    Stack,
    Typography,
    Card,
    CardContent,
    Divider,
    Grid,
    Chip,
    IconButton,
    Tooltip,
    Container,
    LinearProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Snackbar,
    Stepper,
    Step,
    StepLabel,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { useLocation, useParams } from "react-router-dom";
import { startSolanaDraw } from "../../lib/api";

import { useDrawSSE } from "./hooks/useDrawSSE";
import { StatusBar } from "./components/StatusBar";
import { BlocksPanel } from "./components/BlocksPanel";
import { ResultPanel } from "./components/ResultPanel";
import { TracePanel } from "./components/TracePanel";
// import { InterpretationPanel } from "./components/InterpretationPanel";
import { ServerEntropyPanel } from "./components/ServerEntropyPanel";
import { ComparePanel } from "./components/ComparePanel";
import { LiveLog } from "./components/LiveLog";
import { QualityPanel } from "./components/QualityPanel";
import {RangePanel} from "./components/RangePanel.tsx";

type Status = "waiting" | "committed" | "finalized" | "mixing" | "done";

export default function LiveDraw({ drawIdOverride }: { drawIdOverride?: string } = {}) {
    const { drawId: drawIdParam = "" } = useParams();
    const drawId = drawIdOverride ?? drawIdParam;
    const qs = new URLSearchParams(useLocation().search);
    const mode = qs.get("mode"); // "solana-blocks"
    const blocksCount = parseInt(qs.get("blocks") || "3", 10);

    const {
        events,
        statusNote,
        inputs,
        blocksList,
        beaconHex,
        seedHex,
        result,
        trace,
        locBytes,
        locPackets,
        locRoot,
        collectOpen,
        collectRemainMs,
        locSummary,
        compare,
    } = useDrawSSE(drawId);

    // запуск бэка 1 раз
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

    // вычисляем этапы и прогресс
    const {
        steps,
        activeIndex,
        percent,
        currentText,
        done: { srcDone, noiseDone, mixDone, resultDone },
    } = useSteps({
        hasBlocks: blocksList.length > 0,
        hasFinalized: events.some((e) => e.type === "block.finalized_all"),
        noiseOpen: !!collectOpen,
        noiseClosed: events.some((e) => e.type === "collect.close" || e.type === "collect.summary"),
        hasLOC: inputs.includes("LOC") || locBytes > 0 || !!locSummary,
        mixed: events.some((e) => e.type === "mix.trace" || e.type === "result"),
        hasResult: events.some((e) => e.type === "result"),
        remainMs: collectRemainMs ?? null,
    });

    // статусная агрегирующая «фаза»
    const status: Status = useMemo(() => {
        const types = events.map((e) => e.type);
        if (types.includes("result")) return "done";
        if (types.includes("mix.start")) return "mixing";
        if (types.includes("block.finalized_all")) return "finalized";
        if (types.includes("commit")) return "committed";
        return "waiting";
    }, [events]);

    // UI helpers
    const [copied, setCopied] = useState<string | null>(null);
    const copy = (text: string, label: string) =>
        navigator.clipboard.writeText(text).then(() => setCopied(label));

    const sourceChips = (
        <Stack direction="row" spacing={1} flexWrap="wrap">
            <Chip size="small" label={`Блоков: ${blocksCount}`} />
            {inputs.includes("PUB") && <Chip size="small" label="Источник: блоки (PUB)" />}
            {inputs.includes("LOC") && <Chip color="primary" size="small" label="Шум сервера (LOC)" />}
            {locBytes > 0 && <Chip size="small" label={`LOC bytes: ${locBytes}`} />}
        </Stack>
    );

    return (
        <Container sx={{ my: 6, pb: 6 }}>
            <Stack spacing={3}>
                {/* ───────────── Header (минимум) ───────────── */}
                <Stack spacing={0.5}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: -0.2 }}>
                            Draw
                        </Typography>
                        <Chip label={statusLabel(status)} size="small" />
                    </Stack>

                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                    >
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="overline" color="text.secondary">
                                ID:
                            </Typography>
                            <Box sx={{ fontSize: 14 }}>{drawId}</Box>
                            <Tooltip title="Copy draw id">
                                <IconButton size="small" onClick={() => copy(drawId, "Draw ID")}>
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Stack>

                        <Box sx={{ flex: 1 }} />

                        {sourceChips}
                    </Stack>
                </Stack>

                {/* ───────────── Главная: Статус + Прогресс + Результат ───────────── */}
                <Card variant="outlined">
                    <CardContent>
                        {/* компактный статус (иконки/подсказки) */}
                        <StatusBar
                            status={status}
                            inputs={inputs}
                            statusNote={statusNote}
                            collectOpen={collectOpen}
                            collectRemainMs={collectRemainMs}
                        />

                        {/* Stepper (яблочный минимал) */}
                        <Box sx={{ mt: 2 }}>
                            <Stepper activeStep={activeIndex} alternativeLabel>
                                {steps.map((s) => (
                                    <Step key={s.key} completed={s.state === "done"}>
                                        <StepLabel
                                            icon={
                                                s.state === "done" ? (
                                                    <CheckCircleIcon color="success" fontSize="small" />
                                                ) : s.state === "doing" ? (
                                                    <AutoAwesomeIcon color="primary" fontSize="small" />
                                                ) : (
                                                    <HourglassEmptyIcon fontSize="small" />
                                                )
                                            }
                                        >
                                            <Typography variant="caption" color={s.state === "doing" ? "primary.main" : "text.secondary"}>
                                                {s.label}
                                            </Typography>
                                        </StepLabel>
                                    </Step>
                                ))}
                            </Stepper>

                            <Box sx={{ mt: 1.5 }}>
                                <LinearProgress variant="determinate" value={percent} />
                                <Typography variant="caption" color="text.secondary">
                                    {currentText}
                                </Typography>
                            </Box>
                        </Box>

                        {/* Результат – справа, без лишнего шума */}
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            <Grid size={{ xs: 12, md: 7 }}>
                                {/* пусто: тут мы оставили только прогресс/тексты; детали — в аккордеонах */}
                            </Grid>
                            <Grid size={{ xs: 12, md: 5 }}>
                                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, flexWrap: "wrap" }}>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        Результат
                                    </Typography>
                                    {seedHex && (
                                        <Tooltip title="Copy seed">
                                            <IconButton size="small" onClick={() => copy(seedHex, "Seed")}>
                                                <ContentCopyIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Box>
                                <ResultPanel seedHex={seedHex} result={result} />
                            </Grid>
                        </Grid>
                        {seedHex && (
                            <RangePanel seedHex={seedHex} drawId={drawId} />
                        )}
                        <Box sx={{ my: 1}}/>
                        {/* {seedHex && <QualityPanel seedHex={seedHex} />} */}
                    </CardContent>
                </Card>

                {/* ───────────── Детали (свернуто по умолчанию) ───────────── */}

                {/* Источник и beacon */}
                <SectionAccordion
                    title="Источник и beacon"
                    done={srcDone}
                    summaryHint={srcDone ? "Блоки найдены" : "Ожидание блоков"}
                >
                    <BlocksPanel blocks={blocksList} beaconHex={beaconHex} />
                </SectionAccordion>

                {/* Влияние шума (сравнение) */}
                {compare && (
                    <SectionAccordion
                        title="Влияние шума (PUB vs PUB+LOC)"
                        done={noiseDone && mixDone}
                        summaryHint="Сравнение готово"
                    >
                        <ComparePanel pub={compare.pub} pub_loc={compare.pub_loc} />
                    </SectionAccordion>
                )}

                {/* Трассировка */}
                {trace && (
                    <SectionAccordion
                        title="Как получено число (трассировка)"
                        done={mixDone}
                        summaryHint="Сид, ChaCha и u64 зафиксированы"
                    >
                        <TracePanel trace={trace} />
                    </SectionAccordion>
                )}

                {/* Серверный шум */}
                <SectionAccordion
                    title="Серверный шум (детали)"
                    done={noiseDone}
                    summaryHint={noiseDone ? "Шум собран" : "Сбор шума"}
                >
                    <ServerEntropyPanel
                        locBytes={locBytes}
                        locPackets={locPackets}
                        locRoot={locRoot}
                        summary={
                            locSummary
                                ? {
                                    urandomBytes: locSummary.urandomBytes,
                                    jitterBatches: locSummary.jitterBatches,
                                    jitterBytes: locSummary.jitterBytes,
                                    jitterSamplesTotal: locSummary.jitterSamplesTotal,
                                }
                                : null
                        }
                    />
                </SectionAccordion>

                {/* Лог */}
                <SectionAccordion title="Live log" done={resultDone} summaryHint="Технические события">
                    <LiveLog events={events} />
                </SectionAccordion>
            </Stack>

            <Snackbar
                open={!!copied}
                autoHideDuration={1500}
                onClose={() => setCopied(null)}
                message={`${copied} copied`}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            />
        </Container>
    );
}

/* ───────────── helpers ───────────── */

function statusLabel(
    status: "waiting" | "committed" | "finalized" | "mixing" | "done"
): string {
    switch (status) {
        case "waiting":
            return "Waiting";
        case "committed":
            return "Committed";
        case "finalized":
            return "Blocks finalized";
        case "mixing":
            return "Mixing…";
        case "done":
            return "Done";
        default:
            return "";
    }
}

function SectionAccordion({
                              title,
                              children,
                              done,
                              summaryHint,
                          }: {
    title: string;
    children: React.ReactNode;
    done?: boolean;
    summaryHint?: string;
}) {
    return (
        <Accordion elevation={0} disableGutters>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ width: "100%", justifyContent: "space-between" }}
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        {done && <CheckCircleIcon color="success" fontSize="small" />}
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            {title}
                        </Typography>
                    </Stack>
                    {summaryHint && (
                        <Typography variant="caption" color="text.secondary">
                            {summaryHint}
                        </Typography>
                    )}
                </Stack>
            </AccordionSummary>
            <AccordionDetails>
                <Divider sx={{ mb: 2 }} />
                {children}
            </AccordionDetails>
        </Accordion>
    );
}

/**
 * Карта шагов прогресса:
 * 0: Получаем блоки сети Solana…
 * 1: Блоки найдены.
 * 2: Перечисление блоков…
 * 3: Сбор серверного шума… / Шум собран. (опционально)
 * 4: Наложение шумов
 * 5: Шумы наложены
 * 6: Результат
 */
function useSteps(args: {
    hasBlocks: boolean;
    hasFinalized: boolean;
    noiseOpen: boolean;
    noiseClosed: boolean;
    hasLOC: boolean;
    mixed: boolean;
    hasResult: boolean;
    remainMs: number | null;
}) {
    const {
        hasBlocks,
        hasFinalized,
        noiseOpen,
        noiseClosed,
        hasLOC,
        mixed,
        hasResult,
        remainMs,
    } = args;

    // какие шаги присутствуют (шум — опционально)
    const includeNoise = hasLOC || noiseOpen || noiseClosed;

    type StepState = "todo" | "doing" | "done";
    type StepItem = { key: string; label: string; state: StepState };

    // формируем состояния шагов
    const steps: StepItem[] = [];

    // 0
    steps.push({
        key: "fetch",
        label: "Получаем блоки сети Solana…",
        state: !hasFinalized ? "doing" : "done",
    });
    // 1
    steps.push({
        key: "found",
        label: "Блоки найдены.",
        state: hasFinalized ? "done" : "todo",
    });
    // 2
    steps.push({
        key: "list",
        label: "Перечисление блоков…",
        state: hasBlocks ? "done" : hasFinalized ? "doing" : "todo",
    });
    // 3 (optional)
    if (includeNoise) {
        steps.push({
            key: "collect",
            label: noiseClosed ? "Шум собран." : "Сбор серверного шума…",
            state: noiseClosed ? "done" : noiseOpen ? "doing" : "todo",
        });
    }
    // 4
    steps.push({
        key: "mix",
        label: "Наложение шумов",
        state: mixed ? "done" : hasFinalized ? "doing" : "todo",
    });
    // 5
    steps.push({
        key: "mixed",
        label: "Шумы наложены",
        state: mixed ? "done" : "todo",
    });
    // 6
    steps.push({
        key: "result",
        label: "Результат",
        state: hasResult ? "done" : mixed ? "doing" : "todo",
    });

    // активный индекс — первый не-done
    const activeIndex = Math.max(
        0,
        steps.findIndex((s) => s.state !== "done")
    );

    // проценты: доля done + половинка за doing
    const doneCount = steps.filter((s) => s.state === "done").length;
    const hasDoing = steps.some((s) => s.state === "doing");
    const base = (doneCount / steps.length) * 100;
    const percent = Math.min(100, base + (hasDoing ? 6 : 0)); // лёгкий «подъём» на active

    // текущий текст под прогрессом
    let currentText = steps[activeIndex]?.label ?? "Готово";
    if (steps[activeIndex]?.key === "collect" && typeof remainMs === "number") {
        currentText = `Сбор серверного шума… ${Math.ceil(remainMs / 1000)} с`;
    }

    // флаги готовности для секций
    const srcDone = hasBlocks;
    const noiseDone = includeNoise ? noiseClosed : true;
    const mixDone = mixed;
    const resultDone = hasResult;

    return {
        steps,
        activeIndex: activeIndex === -1 ? steps.length - 1 : activeIndex,
        percent,
        currentText,
        done: { srcDone, noiseDone, mixDone, resultDone },
    };
}
