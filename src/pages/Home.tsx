import { useState } from "react";
import {Box, Button, Card, CardContent, Container, Stack, TextField, Typography} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { startSolanaDraw } from "../lib/api";

export default function Home() {
    const nav = useNavigate();
    const [drawId, setDrawId] = useState(`demo-${Date.now()}`);
    const [blocks, setBlocks] = useState(3);
    const [loading, setLoading] = useState(false);

    const onStart = () => {
        nav(`/draw/${encodeURIComponent(drawId)}?mode=solana-blocks&blocks=${blocks}`);
    };

    return (
        <Container sx={{ mt: 6}}>
            <Card variant="outlined">
                <CardContent>
                    <Typography variant="h5" gutterBottom>Start Solana Draw</Typography>
                    <Stack spacing={2} sx={{ maxWidth: 520 }}>
                        <TextField
                            label="Draw ID"
                            value={drawId}
                            onChange={(e) => setDrawId(e.target.value)}
                            fullWidth
                        />
                        <TextField
                            label="Blocks to include"
                            type="number"
                            inputProps={{ min: 1, max: 12 }}
                            value={blocks}
                            onChange={(e) => setBlocks(parseInt(e.target.value || "3", 10))}
                        />
                        <Box>
                            <Button variant="contained" onClick={onStart} disabled={loading}>
                                {loading ? "Starting..." : "Start & Watch"}
                            </Button>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                            Бек сам отправит события “commit → finalized blocks → mix → result”. На странице тиража это будет видно в реальном времени.
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    );
}
