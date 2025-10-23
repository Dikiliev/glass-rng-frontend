import { Card, CardContent, Typography, Box, Divider, Stack, TextField, Chip, Alert } from "@mui/material";
import { useState } from "react";
import { modNUnbiasedPreview, u64ToDecimalString } from "../../../lib/big";

type Props = { result: string | null };

export function InterpretationPanel({ result }: Props) {
    const [nStr, setNStr] = useState("100");

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                    Интерпретация результата
                </Typography>
                {!result ? (
                    <Typography variant="body2" color="text.secondary">
                        Ждём результат…
                    </Typography>
                ) : (
                    <>
                        <Typography variant="body2" gutterBottom>
                            Равномерное в [0,1) (клиент, BigInt)
                        </Typography>
                        <Box sx={{ fontFamily: "monospace", fontSize: 14 }}>
                            {u64ToDecimalString(BigInt(result), 18)}
                            <br />
                            {`${result}/18446744073709551616`}
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="body2" gutterBottom>
                            Равномерное в 0..N-1 (демо)
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <TextField size="small" label="N" value={nStr} onChange={(e) => setNStr(e.target.value)} />
                            {(() => {
                                let N: bigint;
                                try { N = BigInt(nStr); } catch { N = 0n; }
                                if (N <= 1n) {
                                    return <Typography variant="body2" color="text.secondary">Введите N ≥ 2</Typography>;
                                }
                                const { value, biased } = modNUnbiasedPreview(BigInt(result), N);
                                return (
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Chip label={`x mod N = ${value.toString()}`} />
                                        {biased && <Alert severity="warning" sx={{ py: 0 }}>Для полной честности нужен rejection (на бэке).</Alert>}
                                    </Stack>
                                );
                            })()}
                        </Stack>
                    </>
                )}
            </CardContent>
        </Card>
    );
}
