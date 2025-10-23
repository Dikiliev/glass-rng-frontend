import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";

type Props = {
    locBytes: number;
    locPackets: number;
    locRoot: string | null;
    // опциональная сводка от сервера
    summary?: {
        urandomBytes?: number;
        jitterBatches?: number;
        jitterBytes?: number;
        jitterSamplesTotal?: number;
    } | null;
};

export function ServerEntropyPanel({ locBytes, locPackets, locRoot, summary }: Props) {
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="subtitle1" gutterBottom>Server entropy</Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                    <Chip label={`LOC bytes: ${locBytes}`} />
                    <Chip label={`packets: ${locPackets}`} />
                    {locRoot && <Chip label={`root: ${locRoot.slice(0, 10)}…`} />}
                    {summary?.urandomBytes != null && <Chip label={`urandom: ${summary.urandomBytes} B`} />}
                    {summary?.jitterBatches != null && <Chip label={`jitter batches: ${summary.jitterBatches}`} />}
                    {summary?.jitterBytes != null && <Chip label={`jitter bytes: ${summary.jitterBytes}`} />}
                    {summary?.jitterSamplesTotal != null && <Chip label={`jitter samples: ${summary.jitterSamplesTotal}`} />}
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Эти байты автоматически собираются сервером (OS RNG + CPU jitter) до начала смешивания.
                </Typography>
            </CardContent>
        </Card>
    );
}
