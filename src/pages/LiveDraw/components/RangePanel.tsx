// src/pages/LiveDraw/components/RangePanel.tsx
import { useState } from "react";
import { Card, CardContent, Stack, TextField, Button, Typography, Chip, Tooltip, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { sampleRangeBySeed } from "../../../lib/api";

export function RangePanel({ seedHex, drawId }: { seedHex: string | null; drawId: string }) {
    const [n1, setN1] = useState("1");
    const [n2, setN2] = useState("100");
    const [label, setLabel] = useState("RANGE/v1");
    const [res, setRes] = useState<null | any>(null);
    const [loading, setLoading] = useState(false);

    const canRun = !!seedHex && Number.isFinite(Number(n1)) && Number.isFinite(Number(n2));

    const run = async () => {
        if (!seedHex) return;
        setLoading(true);
        try {
            const data = await sampleRangeBySeed({
                seed_hex: seedHex,
                n1, n2, label,
                draw_id: drawId, // хотим ещё и SSE-лог, можно убрать
            });
            setRes(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card variant="outlined">
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="subtitle1">Число в диапазоне</Typography>
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                    <TextField label="От" size="small" value={n1} onChange={e => setN1(e.target.value)} sx={{ width: 160 }} />
                    <TextField label="До" size="small" value={n2} onChange={e => setN2(e.target.value)} sx={{ width: 160 }} />
                    <TextField label="Label" size="small" value={label} onChange={e => setLabel(e.target.value)} sx={{ width: 220 }} />
                    <Button onClick={run} disabled={!canRun || loading} variant="contained">
                        {loading ? "…" : "Сгенерировать"}
                    </Button>
                </Stack>

                {res && (
                    <Stack spacing={1} sx={{ mt: 2 }}>
                        <Typography variant="h4">{res.value}</Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Chip label={`диапазон: [${res.lo}..${res.hi}]`} />
                            <Chip label={`размер: ${res.rangeSize}`} />
                            <Chip label={`попыток: ${res.attempts}`} />
                            {res.rejected > 0 && <Chip color="warning" label={`отклонено: ${res.rejected}`} />}
                            <Chip label={`label: ${res.label}`} />
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Typography variant="body2" color="text.secondary">subseed:</Typography>
                            <code style={{ fontSize: 12, wordBreak: "break-all" }}>{res.subseedHex}</code>
                            <Tooltip title="Copy">
                                <IconButton size="small" onClick={() => navigator.clipboard.writeText(res.subseedHex)}>
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                            Честная выборка без смещения (rejection sampling). Для новой независимой выборки поменяйте Label (например, prize#2).
                        </Typography>
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
}
