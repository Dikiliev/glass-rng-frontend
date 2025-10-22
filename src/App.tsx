import { AppBar, Toolbar, Typography, Container } from "@mui/material";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import {LiveDraw} from "./pages/LiveDraw";

export default function App() {
    return (
        <>
            <AppBar position="sticky" color="inherit" elevation={1}>
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Glass RNG — Solana Live
                    </Typography>
                    <Typography variant="body2" component={Link} to="/" style={{ textDecoration: 'none' }}>
                        Home
                    </Typography>
                </Toolbar>
            </AppBar>
            <Container sx={{ py: 4 }}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/draw/:drawId" element={<LiveDraw />} />
                </Routes>
            </Container>
        </>
    );
}
