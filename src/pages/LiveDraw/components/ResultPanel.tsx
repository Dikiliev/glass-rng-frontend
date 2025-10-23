import { Box, Card, CardContent, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

type Props = {
    seedHex: string | null;
    result: string | null;
};

export function ResultPanel({ seedHex, result }: Props) {
    const copy = (t: string) => navigator.clipboard.writeText(t);

    return (
        <>
            <Typography variant="subtitle1" gutterBottom>
                Итог (после смешивания)
            </Typography>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="body2" color="text.secondary">
                        Seed (HKDF)
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, wordBreak: "break-all" }}>
                        <code style={{ fontSize: 12 }}>{seedHex ?? "—"}</code>
                        {seedHex && (
                            <Tooltip title="Copy seed">
                                <IconButton size="small" onClick={() => copy(seedHex)}>
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Typography variant="h4">{result ?? "…"}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        u64 ∈ 0..2^64−1
                    </Typography>
                </CardContent>
            </Card>
        </>
    );
}
