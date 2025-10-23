import { Card, CardContent, Stack, Typography } from "@mui/material";
import type { MixTraceEvent } from "../types";

type Props = { trace: MixTraceEvent };

export function TracePanel({ trace }: Props) {
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                    Как получено число — шаг за шагом
                </Typography>
                <Stack spacing={1} sx={{ mb: 2 }}>
                    <Typography variant="body2">3) Домашинг источника: H("SOL"‖beacon).</Typography>
                    <Typography variant="body2">4) HKDF с солью от drawId → seed.</Typography>
                    <Typography variant="body2">5) ChaCha20(seed) → первые 8 байт = u64.</Typography>
                    <Typography variant="body2">6) Нормализация: u64 / 2^64 → [0,1).</Typography>
                </Stack>

                <Stack spacing={1}>
                    <div><b>beaconHex:</b> <code style={{ fontSize: 12, wordBreak:"break-all" }}>{trace.beaconHex}</code></div>
                    <div><b>H("SOL"‖beacon):</b> <code style={{ fontSize: 12, wordBreak:"break-all" }}>{trace.pubComponentHex}</code></div>
                    <div><b>HKDF salt:</b> <code style={{ fontSize: 12 }}>{trace.hkdfSaltHex}</code></div>
                    <div><b>seed:</b> <code style={{ fontSize: 12, wordBreak:"break-all" }}>{trace.seedHex}</code></div>
                    <div><b>ChaCha first 16 bytes:</b> <code style={{ fontSize: 12 }}>{trace.chachaFirst16Hex}</code></div>
                    <div><b>u64:</b> <code style={{ fontSize: 12 }}>{trace.u64}</code></div>
                    <div>
                        <b>u ∈ [0,1) (сервер):</b>{" "}
                        <code style={{ fontSize: 12 }}>{trace.u01.decimal18}</code>{" "}
                        <span style={{ color: "#666" }}>({trace.u01.fraction.num}/{trace.u01.fraction.den})</span>
                    </div>
                </Stack>
            </CardContent>
        </Card>
    );
}
