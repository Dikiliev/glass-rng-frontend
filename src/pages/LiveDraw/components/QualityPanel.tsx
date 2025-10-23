import { useState } from "react";
import { Card, CardContent, Stack, Button, TextField, MenuItem, Typography } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { api } from "../../../lib/http"; // ваш axios-инстанс

type Props = { seedHex: string | null };

export function QualityPanel({ seedHex }: Props) {
    const [bits, setBits] = useState(1_000_000);
    const [fmt, setFmt] = useState<"txt"|"bin">("txt");
    const [sep, setSep] = useState<"none"|"newline">("none");
    const disabled = !seedHex;

    const download = async () => {
        if (!seedHex) return;
        const res = await api.post(
            "/tests/bitstream/by-seed",
            { seed_hex: seedHex, bits, fmt, sep },
            { responseType: "blob" }
        );
        const blob = new Blob([res.data], { type: fmt === "txt" ? "text/plain" : "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `bits_${bits}_${fmt}.${fmt === "txt" ? "txt" : "bin"}`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="subtitle1" gutterBottom>Проверка качества (выгрузка бит)</Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="center">
                    <TextField
                        label="Количество бит"
                        size="small"
                        type="number"
                        value={bits}
                        onChange={(e) => setBits(Math.max(1, parseInt(e.target.value || "0", 10)))}
                        sx={{ width: 180 }}
                        inputProps={{ min: 1 }}
                    />
                    <TextField label="Формат" select size="small" value={fmt} onChange={(e) => setFmt(e.target.value as any)} sx={{ width: 160 }}>
                        <MenuItem value="txt">TXT (ASCII 0/1)</MenuItem>
                        <MenuItem value="bin">BIN (сырые байты)</MenuItem>
                    </TextField>
                    {fmt === "txt" && (
                        <TextField label="Разделитель" select size="small" value={sep} onChange={(e) => setSep(e.target.value as any)} sx={{ width: 180 }}>
                            <MenuItem value="none">Без разделителей</MenuItem>
                            <MenuItem value="newline">По одному биту в строке</MenuItem>
                        </TextField>
                    )}
                    <Button variant="contained" startIcon={<DownloadIcon />} onClick={download} disabled={disabled}>
                        Скачать
                    </Button>
                </Stack>
                {!seedHex && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Сначала дождитесь результата тиража — тогда можно выгрузить биты из его seed.
                    </Typography>
                )}
            </CardContent>
        </Card>
    );
}
