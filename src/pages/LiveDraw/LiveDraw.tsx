// src/pages/LiveDraw/LiveDraw.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
    Box,
    Stack,
    Typography,
    Card,
    CardContent,
    Divider,
    Chip,
    IconButton,
    Tooltip,
    Container,
    LinearProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Snackbar,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useLocation, useParams } from "react-router-dom";
import { startSolanaDraw } from "../../lib/api";

import { useDrawSSE } from "./hooks/useDrawSSE";
import { StatusBar } from "./components/StatusBar";
import { BlocksPanel } from "./components/BlocksPanel";
import { ResultPanel } from "./components/ResultPanel";
import { TracePanel } from "./components/TracePanel";
import { ServerEntropyPanel } from "./components/ServerEntropyPanel";
import { ComparePanel } from "./components/ComparePanel";
import { LiveLog } from "./components/LiveLog";
import { RangePanel } from "./components/RangePanel";

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

    // вычисляем прогресс
    const {
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

    const isDone = status === "done" && seedHex;
    const isLoading = !isDone;

    return (
        <Container sx={{ my: 6, pb: 6 }}>
            <Stack spacing={4}>
                {/* ───────────── Заголовок (компактный) ───────────── */}
                <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
                    <Typography variant="h5" sx={{ fontWeight: 600 }}>
                        Генерация случайного числа
                    </Typography>
                    <Chip 
                        label={statusLabel(status)} 
                        size="small"
                        color={isDone ? "success" : "default"}
                    />
                </Stack>

                {/* ───────────── Главная область: Прогресс или Результат ───────────── */}
                {isLoading ? (
                    // Пока идет генерация - показываем прогресс
                    <Card variant="outlined">
                        <CardContent sx={{ py: 8 }}>
                            <Stack spacing={4} alignItems="center">
                                <Box sx={{ width: "100%", maxWidth: 600 }}>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={percent} 
                                        sx={{ 
                                            height: 10, 
                                            borderRadius: 999,
                                            boxShadow: "0 0 20px rgba(153, 69, 255, 0.3)",
                                        }}
                                    />
                                    <Typography 
                                        variant="body1" 
                                        color="text.secondary" 
                                        sx={{ 
                                            mt: 3, 
                                            textAlign: "center", 
                                            fontWeight: 500,
                                            fontSize: "18px",
                                            letterSpacing: 0.3,
                                        }}
                                    >
                                        {currentText}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                ) : (
                    // Когда готово - показываем число
                    seedHex && <RangePanel seedHex={seedHex} drawId={drawId} />
                )}

                {/* ───────────── Детали (все в одном аккордеоне) ───────────── */}
                <Accordion elevation={0} defaultExpanded={false}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Детали генерации
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Stack spacing={3} divider={<Divider />}>
                            {/* Информация о draw */}
                            <Stack spacing={1}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                    ID генерации
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="body2" sx={{ fontFamily: "monospace" }}>
                                        {drawId}
                                    </Typography>
                                    <Tooltip title="Copy draw id">
                                        <IconButton size="small" onClick={() => copy(drawId, "Draw ID")}>
                                            <ContentCopyIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </Stack>
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    {sourceChips}
                                </Stack>
                            </Stack>

                            {/* Статус бар */}
                            <StatusBar
                                status={status}
                                inputs={inputs}
                                statusNote={statusNote}
                                collectOpen={collectOpen}
                                collectRemainMs={collectRemainMs}
                            />

                            {/* Результат (технический) */}
                            {seedHex && (
                                <Stack spacing={1}>
                                    <Box sx={{ display: "flex", alignItems: "baseline", gap: 1, flexWrap: "wrap" }}>
                                        <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 600 }}>
                                            Результат (seed)
                                        </Typography>
                                        <Tooltip title="Copy seed">
                                            <IconButton size="small" onClick={() => copy(seedHex, "Seed")}>
                                                <ContentCopyIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                    <ResultPanel seedHex={seedHex} result={result} />
                                </Stack>
                            )}

                            {/* Источник и beacon */}
                            <SectionAccordion
                                title="Источник и beacon"
                                done={srcDone}
                                summaryHint={srcDone ? "Блоки найдены" : "Ожидание блоков"}
                            >
                                <BlocksPanel blocks={blocksList} beaconHex={beaconHex} />
                            </SectionAccordion>

                            {/* Влияние шума */}
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
                    </AccordionDetails>
                </Accordion>
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
        <Accordion elevation={0}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    sx={{ width: "100%", justifyContent: "space-between" }}
                >
                    <Stack direction="row" spacing={1} alignItems="center">
                        {done && <CheckCircleIcon color="success" fontSize="small" />}
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
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
                {children}
            </AccordionDetails>
        </Accordion>
    );
}

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

    const includeNoise = hasLOC || noiseOpen || noiseClosed;

    type StepState = "todo" | "doing" | "done";
    type StepItem = { key: string; label: string; state: StepState };

    const steps: StepItem[] = [
        {
            key: "fetch",
            label: "Получаем блоки сети Solana…",
            state: !hasFinalized ? "doing" : "done",
        },
        {
            key: "found",
            label: "Блоки найдены.",
            state: hasFinalized ? "done" : "todo",
        },
        {
            key: "list",
            label: "Перечисление блоков…",
            state: hasBlocks ? "done" : hasFinalized ? "doing" : "todo",
        },
        ...(includeNoise
            ? [
                  {
                      key: "collect",
                      label: noiseClosed ? "Шум собран." : "Сбор серверного шума…",
                      state: noiseClosed ? "done" : noiseOpen ? "doing" : "todo",
                  } as StepItem,
              ]
            : []),
        {
            key: "mix",
            label: "Наложение шумов",
            state: mixed ? "done" : hasFinalized ? "doing" : "todo",
        },
        {
            key: "mixed",
            label: "Шумы наложены",
            state: mixed ? "done" : "todo",
        },
        {
            key: "result",
            label: "Результат",
            state: hasResult ? "done" : mixed ? "doing" : "todo",
        },
    ];

    const activeIndex = Math.max(0, steps.findIndex((s) => s.state !== "done"));
    const doneCount = steps.filter((s) => s.state === "done").length;
    const hasDoing = steps.some((s) => s.state === "doing");
    const base = (doneCount / steps.length) * 100;
    const percent = Math.min(100, base + (hasDoing ? 6 : 0));

    let currentText = steps[activeIndex]?.label ?? "Готово";
    if (steps[activeIndex]?.key === "collect" && typeof remainMs === "number") {
        currentText = `Сбор серверного шума… ${Math.ceil(remainMs / 1000)} с`;
    }

    return {
        percent,
        currentText,
        done: {
            srcDone: hasBlocks,
            noiseDone: includeNoise ? noiseClosed : true,
            mixDone: mixed,
            resultDone: hasResult,
        },
    };
}
