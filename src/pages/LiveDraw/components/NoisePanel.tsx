import { useRef } from "react";
import { Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { makeHumanPulseCollector } from "../../../lib/entropy";
import { addServerJitter, sendUserEntropy } from "../../../lib/api";

type Props = {
    drawId: string;
    locBytes: number;
    locPackets: number;
    locRoot: string | null;
};

export function NoisePanel({ drawId, locBytes, locPackets, locRoot }: Props) {
    const collectorRef = useRef<ReturnType<typeof makeHumanPulseCollector> | null>(null);

    const startCapture = () => {
        if (!collectorRef.current) collectorRef.current = makeHumanPulseCollector();
        collectorRef.current.clear();
        collectorRef.current.start();
    };
    const stopCapture = () => collectorRef.current?.stop();
    const sendCapture = async () => {
        const hex = collectorRef.current?.payloadHex() ?? "";
        if (!hex) return;
        try { await sendUserEntropy(drawId, hex); } catch (e) { console.error(e); }
    };
    const serverJitter = async () => {
        try { await addServerJitter(drawId, 20000); } catch (e) { console.error(e); }
    };

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                    Добавить локальный шум (до смешивания)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Двигайте мышью / нажимайте клавиши → собираем микрозадержки. Затем отправьте на сервер —
                    сырые байты попадут в транскрипт и будут учтены как независимый источник «LOC».
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Button size="small" variant="outlined" onClick={startCapture}>Start capture</Button>
                    <Button size="small" variant="outlined" onClick={stopCapture}>Stop</Button>
                    <Button size="small" variant="contained" onClick={sendCapture}>Send to server</Button>
                    <Button size="small" variant="outlined" onClick={serverJitter}>Add server jitter (+20k)</Button>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <Chip label={`LOC bytes: ${locBytes}`} />
                    <Chip label={`packets: ${locPackets}`} />
                    {locRoot && <Chip label={`root: ${locRoot.slice(0, 10)}…`} />}
                </Stack>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    После добавления шума перезапустите тираж — в “Sources” появится <b>LOC</b>.
                </Typography>
            </CardContent>
        </Card>
    );
}
