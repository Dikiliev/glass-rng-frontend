import { useState } from "react";
import { AppBar, Toolbar, Container, Box, Button, IconButton, Stack, Divider, Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";

function createDemoId() {
    return `demo-${Date.now()}`;
}

export default function AppHeader() {
    const [open, setOpen] = useState(false);
    const nav = useNavigate();

    const startDemo = () => {
        const id = createDemoId();
        nav(`/draws/${id}?mode=solana-blocks&blocks=3`);
    };

    const NavLinks = (
        <Stack direction="row" spacing={1}>
            <Button component={RouterLink} to="/" color="inherit">Главная</Button>
            <Button component={RouterLink} to="/history" color="inherit">Истории</Button>
            <Button onClick={startDemo} variant="contained">Start demo</Button>
        </Stack>
    );

    return (
        <AppBar 
            position="sticky" 
            color="transparent" 
            elevation={0} 
            sx={{ 
                backdropFilter: "blur(20px) saturate(180%)",
                backgroundColor: "rgba(10, 14, 39, 0.7)",
                borderBottom: theme => `1px solid ${theme.palette.divider}`,
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            }}
        >
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ minHeight: 68 }}>
                    {/* Brand */}
                    <Box 
                        component={RouterLink} 
                        to="/" 
                        sx={{ 
                            textDecoration: "none", 
                            background: "linear-gradient(135deg, #9945FF 0%, #FF6B9D 100%)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            fontWeight: 700, 
                            fontSize: 20, 
                            letterSpacing: 0.5,
                            transition: "all 0.3s ease",
                            "&:hover": {
                                filter: "drop-shadow(0 0 8px rgba(153, 69, 255, 0.6))",
                                transform: "scale(1.05)",
                            },
                        }}
                    >
                        Glass RNG
                    </Box>

                    <Box sx={{ flex: 1 }} />

                    {/* Desktop */}
                    <Box sx={{ display: { xs: "none", md: "block" } }}>
                        {NavLinks}
                    </Box>

                    {/* Mobile */}
                    <Box sx={{ display: { xs: "block", md: "none" } }}>
                        <IconButton onClick={() => setOpen(true)} aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </Container>

            <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
                <Box sx={{ width: 280, pt: 1 }}>
                    <Box sx={{ px: 2, py: 2, fontWeight: 700 }}>Glass RNG</Box>
                    <Divider />
                    <List>
                        <ListItemButton component={RouterLink} to="/" onClick={() => setOpen(false)}>
                            <ListItemText primary="Home" />
                        </ListItemButton>
                        <ListItemButton onClick={() => { setOpen(false); startDemo(); }}>
                            <ListItemText primary="Start demo" />
                        </ListItemButton>
                        <ListItemButton component={RouterLink} to="/audit" onClick={() => setOpen(false)}>
                            <ListItemText primary="Audit" />
                        </ListItemButton>
                        <ListItemButton component={RouterLink} to="/about" onClick={() => setOpen(false)}>
                            <ListItemText primary="About" />
                        </ListItemButton>
                    </List>
                </Box>
            </Drawer>
        </AppBar>
    );
}
