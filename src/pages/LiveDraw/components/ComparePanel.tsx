import { Box, Card, CardContent, Divider, Grid, IconButton, Tooltip, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

type Side = {
    title: string;
    seedHex: string;
    chachaFirst16Hex: string;
    u64: string;
    u01dec: string;
};

function SideCard({ title, seedHex, chachaFirst16Hex, u64, u01dec }: Side) {
    const copy = (t: string) => navigator.clipboard.writeText(t);
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="subtitle1" gutterBottom>{title}</Typography>
                <Typography variant="body2" color="text.secondary">Seed</Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, wordBreak: "break-all" }}>
                    <code style={{ fontSize: 12 }}>{seedHex}</code>
                    <Tooltip title="Copy seed">
                        <IconButton size="small" onClick={() => copy(seedHex)}><ContentCopyIcon fontSize="small" /></IconButton>
                    </Tooltip>
                </Box>

                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary">ChaCha first 16B</Typography>
                <code style={{ fontSize: 12 }}>{chachaFirst16Hex}</code>

                <Divider sx={{ my: 1 }} />
                <Typography variant="body2" color="text.secondary">u64</Typography>
                <Typography variant="h6">{u64}</Typography>

                <Typography variant="body2" color="text.secondary">u ∈ [0,1)</Typography>
                <code style={{ fontSize: 12 }}>{u01dec}</code>
            </CardContent>
        </Card>
    );
}

type Props = {
    pub: { seedHex: string; chachaFirst16Hex: string; u64: string; u01: { decimal18: string } };
    pub_loc: { seedHex: string; chachaFirst16Hex: string; u64: string; u01: { decimal18: string } };
};

export function ComparePanel({ pub, pub_loc }: Props) {
    const changed = pub.u64 !== pub_loc.u64;
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Влияние шума: до/после смешивания
                    {changed ? " — результат изменился" : " — результат совпал"}
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <SideCard
                            title="Только блоки (PUB)"
                            seedHex={pub.seedHex}
                            chachaFirst16Hex={pub.chachaFirst16Hex}
                            u64={pub.u64}
                            u01dec={pub.u01.decimal18}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <SideCard
                            title="Блоки + локальный шум (PUB+LOC)"
                            seedHex={pub_loc.seedHex}
                            chachaFirst16Hex={pub_loc.chachaFirst16Hex}
                            u64={pub_loc.u64}
                            u01dec={pub_loc.u01.decimal18}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}
