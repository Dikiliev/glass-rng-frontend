import { useEffect, useState } from "react";
import { getHistory, type HistoryItem } from "../../lib/api";
import { Box, Card, CardActionArea, CardContent, Chip, Container, Grid, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

export default function HistoryList() {
    const [items, setItems] = useState<HistoryItem[]>([]);
    useEffect(() => { getHistory().then(r => setItems(r.items)); }, []);

    return (
        <Container sx={{ mt: 6 }}>
            <Stack spacing={2}>
                <Typography variant="h4" fontWeight={700}>История тиражей</Typography>
                <Grid container spacing={2}>
                    {items.map(it => (
                        <Grid key={it.drawId} size={{ xs: 12, md: 6, lg: 4 }}>
                            <Card variant="outlined">
                                <CardActionArea component={RouterLink} to={`/history/${it.drawId}`}>
                                    <CardContent>
                                        <Stack spacing={1}>
                                            <Typography variant="subtitle1" fontWeight={600}>{it.drawId}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {new Date(it.createdAt).toLocaleString()}
                                            </Typography>
                                            <Box>
                                                {it.sources.map(s => <Chip key={s} size="small" label={s} sx={{ mr: .5 }} />)}
                                            </Box>
                                            {it.numberU64 && (
                                                <Typography variant="body2" sx={{ mt: .5 }}>
                                                    u64: {it.numberU64}
                                                </Typography>
                                            )}
                                        </Stack>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Stack>
        </Container>
    );
}
