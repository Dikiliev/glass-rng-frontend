// src/pages/LiveDraw/components/MultiSamplePanel.tsx
import { useMemo, useState } from "react";
import {
    Card,
    CardContent,
    Stack,
    TextField,
    Button,
    Typography,
    Chip,
    Tooltip,
    IconButton,
    Checkbox,
    FormControlLabel,
    Divider,
    Alert,
    LinearProgress,
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { sampleRangeBySeed } from "../../../lib/api";

type RangeResult = {
    value: number | string;
    lo: number;
    hi: number;
    rangeSize: number;
    attempts: number;
    rejected: number;
    label?: string;
    subseedHex?: string;
};

export function MultiSamplePanel({
                                     seedHex,
                                     drawId,
                                 }: {
    seedHex: string | null;
    drawId: string;
}) {
    const [kStr, setKStr] = useState("5");       // K — сколько чисел
    const [nStr, setNStr] = useState("100");     // N — верхняя граница (диапазон [1..N])
    const [unique, setUnique] = useState(true);  // неповторяющиеся
    const [labelBase, setLabelBase] = useState("SET/v1"); // base label для domain separation
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<RangeResult[]>([]);
    const [progress, setProgress] = useState(0); // 0..K

    const k = useMemo(() => Number(kStr), [kStr]);
    const n = useMemo(() => Number(nStr), [nStr]);

    const canRun =
        !!seedHex &&
        Number.isFinite(k) &&
        k > 0 &&
        Number.isFinite(n) &&
        n >= 1 &&
        labelBase.trim().length > 0;

    const copyCSV = async () => {
        const csv = items.map((i) => String(i.value)).join(", ");
        await navigator.clipboard.writeText(csv);
    };
    const copyJSON = async () => {
        const json = JSON.stringify(items.map((i) => Number(i.value)));
        await navigator.clipboard.writeText(json);
    };

    const run = async () => {
        if (!seedHex) return;

        setError(null);
        setItems([]);
        setProgress(0);

        if (unique && k > n) {
            setError(
                "K не может быть больше N при включённой опции «неповторяющиеся»."
            );
            return;
        }

        setLoading(true);
        try {
            const results: RangeResult[] = [];
            const seen = new Set<number>();
            let attemptIndex = 0;

            while (results.length < k) {
                attemptIndex += 1;
                const pickNo = results.length + 1;
                const label = `${labelBase}#${pickNo}/${attemptIndex}`;

                const data = (await sampleRangeBySeed({
                    seed_hex: seedHex,
                    n1: "1",
                    n2: String(n),
                    label,
                    draw_id: drawId, // хотим ещё и SSE-лог; можно убрать при необходимости
                })) as RangeResult;

                const vNum = Number(data.value);

                if (unique && seen.has(vNum)) {
                    // дубликат — пробуем дальше
                    continue;
                }

                seen.add(vNum);
                // сохраним label локально на всякий случай
                results.push({ ...data, label });
                setItems([...results]); // обновляем прогресс на UI
                setProgress(results.length);
            }
        } catch (e) {
            console.error(e);
            setError("Не удалось сгенерировать набор. Проверьте сеть и попробуйте ещё раз.");
        } finally {
            setLoading(false);
        }
    };

    const meta = useMemo(() => {
        if (items.length === 0) return null;
        const attemptsSum = items.reduce((s, i) => s + (Number(i.attempts) || 0), 0);
        const rejectedSum = items.reduce((s, i) => s + (Number(i.rejected) || 0), 0);
        const lo = items[0].lo,
            hi = items[0].hi,
            rangeSize = items[0].rangeSize;
        return { attemptsSum, rejectedSum, lo, hi, rangeSize };
    }, [items]);

    return (
        <Card variant="outlined">
            <CardContent>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 1 }}
                >
                    <Typography variant="subtitle1">Набор чисел</Typography>
                </Stack>

                <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={2}
                    alignItems="center"
                >
                    <TextField
                        label="K (кол-во)"
                        size="small"
                        value={kStr}
                        onChange={(e) => setKStr(e.target.value)}
                        sx={{ width: 160 }}
                        inputProps={{ inputMode: "numeric", pattern: "\\d*" }}
                    />
                    <TextField
                        label="До N"
                        size="small"
                        value={nStr}
                        onChange={(e) => setNStr(e.target.value)}
                        sx={{ width: 160 }}
                        inputProps={{ inputMode: "numeric", pattern: "\\d*" }}
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={unique}
                                onChange={(e) => setUnique(e.target.checked)}
                            />
                        }
                        label="неповторяющиеся"
                    />
                    <TextField
                        label="Label (base)"
                        size="small"
                        value={labelBase}
                        onChange={(e) => setLabelBase(e.target.value)}
                        sx={{ width: 240 }}
                    />
                    <Button onClick={run} disabled={!canRun || loading} variant="contained">
                        {loading ? `Генерация… (${progress}/${isFinite(k) ? k : 0})` : "Сгенерировать набор"}
                    </Button>
                </Stack>

                {loading && (
                    <LinearProgress sx={{ mt: 2 }} variant="determinate" value={Math.min(100, (progress / Math.max(1, k)) * 100)} />
                )}

                {error && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}

                {items.length > 0 && (
                    <>
                        <Divider sx={{ my: 2 }} />
                        <Stack spacing={1}>
                            <Typography variant="h4" sx={{ letterSpacing: -0.2 }}>
                                {items.map((i) => i.value).join("  ")}
                            </Typography>

                            <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center">
                                <Chip label={`элементов: ${items.length}`} />
                                {meta && (
                                    <>
                                        <Chip label={`диапазон: [${meta.lo}..${meta.hi}]`} />
                                        <Chip label={`размер: ${meta.rangeSize}`} />
                                        <Chip label={`сумма attempts: ${meta.attemptsSum}`} />
                                        {meta.rejectedSum > 0 && (
                                            <Chip color="warning" label={`внутр. rejected: ${meta.rejectedSum}`} />
                                        )}
                                    </>
                                )}
                                {unique && <Chip color="success" label="без повторов" />}
                            </Stack>

                            <Stack spacing={0.5} sx={{ mt: 1 }}>
                                {items.map((it, idx) => (
                                    <Stack
                                        key={`${it.label ?? "label"}-${idx}`}
                                        direction={{ xs: "column", sm: "row" }}
                                        alignItems="center"
                                        spacing={1}
                                    >
                                        <Typography variant="body2" color="text.secondary" sx={{ minWidth: 64 }}>
                                            #{idx + 1}
                                        </Typography>
                                        <Typography variant="body1" sx={{ fontWeight: 700, minWidth: 56 }}>
                                            {it.value}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                                            label: <code style={{ fontSize: 12 }}>{it.label}</code>
                                        </Typography>
                                        {it.subseedHex && (
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <Typography variant="body2" color="text.secondary">
                                                    subseed:
                                                </Typography>
                                                <code style={{ fontSize: 12, wordBreak: "break-all" }}>
                                                    {it.subseedHex}
                                                </code>
                                                <Tooltip title="Copy subseed">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => navigator.clipboard.writeText(it.subseedHex!)}
                                                    >
                                                        <ContentCopyIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        )}
                                    </Stack>
                                ))}
                            </Stack>

                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Независимые выборки через domain separation (label). При опции «неповторяющиеся» дубликаты отбрасываются до набора K уникальных значений.
                            </Typography>

                            <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
                                <Tooltip title="Скопировать CSV">
                                    <Button variant="outlined" size="small" onClick={copyCSV} startIcon={<ContentCopyIcon fontSize="small" />}>
                                        CSV
                                    </Button>
                                </Tooltip>
                                <Tooltip title="Скопировать JSON">
                                    <Button variant="outlined" size="small" onClick={copyJSON} startIcon={<ContentCopyIcon fontSize="small" />}>
                                        JSON
                                    </Button>
                                </Tooltip>

                            </Stack>
                        </Stack>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
