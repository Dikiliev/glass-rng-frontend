// src/pages/LiveDraw/components/RangePanel.tsx
import { useState, useEffect } from "react";
import { Card, CardContent, Stack, Typography, Chip, Tooltip, IconButton } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { sampleRangeBySeed } from "../../../lib/api";

export function RangePanel({ seedHex, drawId }: { seedHex: string | null; drawId: string }) {
    const [res, setRes] = useState<null | any>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!seedHex) {
            setRes(null);
            return;
        }

        const generate = async () => {
            setLoading(true);
            try {
                const data = await sampleRangeBySeed({
                    seed_hex: seedHex,
                    n1: "0",
                    n2: "9",
                    label: "RANDOM/v1",
                    draw_id: drawId,
                });
                setRes(data);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        generate();
    }, [seedHex, drawId]);

    return (
        <Card variant="outlined">
            <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                    <Typography variant="subtitle1">Случайное число</Typography>
                </Stack>

                {loading && (
                    <Typography variant="body2" color="text.secondary">
                        Генерация...
                    </Typography>
                )}

                {res && !loading && (
                    <Stack spacing={1} sx={{ mt: 1 }}>
                        <Typography variant="h3" sx={{ fontWeight: 700, fontSize: { xs: 48, md: 64 } }}>
                            {res.value}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Chip label={`диапазон: [${res.lo}..${res.hi}]`} />
                            <Chip label={`размер: ${res.rangeSize}`} />
                            {/* <Chip label={`попыток: ${res.attempts}`} /> */}
                            {res.rejected > 0 && <Chip color="warning" label={`отклонено: ${res.rejected}`} />}
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
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
}
