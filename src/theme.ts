// theme.ts — Solana Visual Spark design for MUI v7
// Темная тема с фиолетово-синими градиентами, эффектами свечения и неоновыми акцентами

import { createTheme, alpha, responsiveFontSizes } from "@mui/material/styles";

// ---------- Fonts (Modern Tech Style) ----------
const FONT_SANS = [
    '"Inter"',
    '"SF Pro Display"',
    '"Segoe UI"',
    '"Roboto"',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'sans-serif',
].join(', ');

const FONT_MONO = [
    '"SF Mono"',
    '"JetBrains Mono"',
    '"Fira Code"',
    'Menlo',
    'Monaco',
    'Consolas',
    'monospace',
].join(', ');

// ---------- Design Tokens (Solana Visual Spark Style) ----------
const tokens = {
    radius: 16,
    radiusLg: 20,
    ring: (hex: string) => `0 0 0 3px ${alpha(hex, 0.3)}, 0 0 20px ${alpha(hex, 0.2)}`,
    // Solana цвета: фиолетовый, розовый, синий, циан
    brand: {
        purple: "#9945FF",    // Solana purple
        pink:   "#FF6B9D",    // Solana pink accent
        blue:   "#14F195",    // Solana green/cyan
        cyan:   "#00D4FF",    // Bright cyan
        violet: "#C77DFF",    // Light purple
        green:  "#14F195",    // Solana green
        orange: "#FFB84D",
        red:    "#FF6B6B",
        yellow: "#FFD93D",
    },
    light: {
        bg:        "#0A0E27",      // Deep dark blue
        paper:     "#141B3A",      // Dark purple-blue
        divider:   "rgba(153, 69, 255, 0.2)",
        textPri:   "#FFFFFF",
        textSec:   "rgba(255, 255, 255, 0.7)",
        codeBg:    "#1A2342",
        scrollbar: "rgba(153, 69, 255, 0.3)",
    },
    dark: {
        bg:        "#0A0E27",      // Deep dark blue background
        paper:     "#141B3A",      // Dark purple-blue cards
        divider:   "rgba(153, 69, 255, 0.3)",
        textPri:   "#FFFFFF",
        textSec:   "rgba(255, 255, 255, 0.65)",
        codeBg:    "#1A2342",
        scrollbar: "rgba(153, 69, 255, 0.4)",
    }
};

// ---------- Glow Shadows (Solana spark effects) ----------
const buildShadows = (): string[] => {
    const glowPurple = "rgba(153, 69, 255, 0.4)";
    const glowPink = "rgba(255, 107, 157, 0.3)";
    const darkBase = "rgba(0, 0, 0, 0.5)";
    
    const s = (y: number, blur: number, spread = 0, colors: string[]) => {
        return colors.map(c => `0 ${y}px ${blur}px ${spread}px ${c}`).join(', ');
    };
    
    const glow = (y: number, blur: number, intensity = 1) => 
        s(y, blur, 0, [
            darkBase,
            alpha(glowPurple, 0.3 * intensity),
            alpha(glowPink, 0.2 * intensity),
        ]);

    // Неоновые тени с эффектом свечения
    return [
        "none",
        glow(1, 4, 0.5),
        glow(2, 8, 0.6),
        glow(4, 12, 0.7),
        glow(6, 16, 0.8),
        glow(8, 20, 0.9),
        glow(10, 24, 1.0),
        glow(12, 28, 1.1),
        glow(14, 32, 1.2),
        glow(16, 36, 1.3),
        glow(18, 40, 1.4),
        glow(20, 44, 1.5),
        glow(22, 48, 1.6),
        glow(24, 52, 1.7),
        glow(26, 56, 1.8),
        glow(28, 60, 1.9),
        glow(30, 64, 2.0),
        glow(32, 68, 2.1),
        glow(34, 72, 2.2),
        glow(36, 76, 2.3),
        glow(38, 80, 2.4),
        glow(40, 84, 2.5),
        glow(42, 88, 2.6),
        glow(44, 92, 2.7),
        glow(46, 96, 2.8),
    ];
};

// ---------- Theme Factory ----------
export function createAppTheme(mode: "light" | "dark" = "light") {
    const t = tokens[mode];
    const brand = tokens.brand;

    const base = createTheme({
        palette: {
            mode: "dark", // Всегда темная тема для Solana стиля
            primary:   { main: brand.purple },
            secondary: { main: brand.pink },
            success:   { main: brand.green },
            warning:   { main: brand.orange },
            error:     { main: brand.red },
            info:      { main: brand.cyan },
            background: {
                default: t.bg,
                paper:   t.paper,
            },
            divider: t.divider,
            text: {
                primary:   t.textPri,
                secondary: t.textSec,
            },
            action: {
                hover: alpha(brand.purple, 0.2),
                selected: alpha(brand.purple, 0.25),
                focus: alpha(brand.purple, 0.3),
                disabled: alpha(t.textPri, 0.32),
                disabledBackground: alpha(t.textPri, 0.06),
            },
        },

        shape: { borderRadius: tokens.radius },

        typography: {
            fontFamily: FONT_SANS,
            fontWeightRegular: 400,
            fontWeightMedium: 500,
            fontWeightBold: 700,
            // Современный tech стиль
            h1: { fontSize: "clamp(42px, 8vw, 80px)", fontWeight: 700, letterSpacing: -1, lineHeight: 1.1 },
            h2: { fontSize: "clamp(32px, 6vw, 56px)", fontWeight: 700, letterSpacing: -0.8, lineHeight: 1.15 },
            h3: { fontSize: 32, fontWeight: 700, letterSpacing: -0.5, lineHeight: 1.2 },
            h4: { fontSize: 24, fontWeight: 600, letterSpacing: -0.3, lineHeight: 1.25 },
            h5: { fontSize: 20, fontWeight: 600, letterSpacing: -0.2, lineHeight: 1.3 },
            h6: { fontSize: 18, fontWeight: 600, letterSpacing: -0.1, lineHeight: 1.35 },
            subtitle1: { fontSize: 16, fontWeight: 500, color: t.textSec, lineHeight: 1.5 },
            body1: { fontSize: 16, lineHeight: 1.6, fontWeight: 400 },
            body2: { fontSize: 15, lineHeight: 1.55, color: t.textSec, fontWeight: 400 },
            button: { textTransform: "none", fontWeight: 600, letterSpacing: 0.3, fontSize: "15px" },
            overline: { textTransform: "none", fontSize: 12, letterSpacing: 1, color: t.textSec, fontWeight: 600 },
            caption: { fontSize: 13, color: t.textSec, lineHeight: 1.5, fontWeight: 400 },
        },

        shadows: buildShadows() as any,

        transitions: {
            duration: {
                shortest: 120,
                shorter:  160,
                short:    200,
                standard: 240,
                complex:  320,
                enteringScreen: 220,
                leavingScreen:  180,
            },
            easing: {
                // cubic-bezier, близкие к iOS spring-like
                easeInOut:  "cubic-bezier(0.4, 0.0, 0.2, 1)",
                easeOut:    "cubic-bezier(0.0, 0.0, 0.2, 1)",
                easeIn:     "cubic-bezier(0.4, 0.0, 1, 1)",
                sharp:      "cubic-bezier(0.4, 0.0, 0.6, 1)",
            },
        },

        components: {
            // --------- Global CSS / Baseline ---------
            MuiCssBaseline: {
                styleOverrides: {
                    ":root": {
                        colorScheme: mode,
                        "--radius": `${tokens.radius}px`,
                        "--radius-lg": `${tokens.radiusLg}px`,
                    },
                    html: { 
                        height: "100%",
                        background: `linear-gradient(135deg, ${t.bg} 0%, #0F1629 100%)`,
                    },
                    body: {
                        minHeight: "100%",
                        backgroundColor: t.bg,
                        backgroundImage: `
                            radial-gradient(circle at 20% 50%, ${alpha(brand.purple, 0.15)} 0%, transparent 50%),
                            radial-gradient(circle at 80% 80%, ${alpha(brand.pink, 0.1)} 0%, transparent 50%),
                            radial-gradient(circle at 40% 20%, ${alpha(brand.cyan, 0.08)} 0%, transparent 50%)
                        `,
                        backgroundAttachment: "fixed",
                        WebkitFontSmoothing: "antialiased",
                        MozOsxFontSmoothing: "grayscale",
                        textRendering: "optimizeLegibility",
                    },
                    a: {
                        color: brand.purple,
                        textDecorationThickness: "1px",
                        textUnderlineOffset: "3px",
                        transition: "all 0.2s ease",
                        "&:hover": {
                            color: brand.pink,
                            textShadow: `0 0 10px ${alpha(brand.pink, 0.5)}`,
                        },
                    },
                    "::selection": { 
                        background: alpha(brand.purple, 0.3),
                        color: "#FFFFFF",
                    },
                    code: {
                        fontFamily: FONT_MONO,
                        background: t.codeBg,
                        borderRadius: 8,
                        padding: "0.12rem 0.35rem",
                    },
                    pre: {
                        fontFamily: FONT_MONO,
                        background: t.codeBg,
                        border: `1px solid ${t.divider}`,
                        borderRadius: tokens.radiusLg,
                        padding: "12px 14px",
                        overflow: "auto",
                    },
                    "*::-webkit-scrollbar": { height: 8, width: 10 },
                    "*::-webkit-scrollbar-thumb": {
                        background: alpha(t.scrollbar, 0.45),
                        borderRadius: 999,
                    },
                    // Glowing focus ring
                    "*:focus-visible": {
                        outline: "none",
                        boxShadow: tokens.ring(brand.purple),
                        borderRadius: tokens.radius,
                    },
                },
            },

            // --------- Surfaces ---------
            MuiPaper: {
                defaultProps: { elevation: 0, variant: "outlined" },
                styleOverrides: {
                    root: { 
                        backgroundImage: "none",
                        backdropFilter: "blur(10px)",
                    },
                    outlined: {
                        border: `1px solid ${t.divider}`,
                        boxShadow: buildShadows()[2],
                        borderRadius: tokens.radiusLg,
                        background: alpha(t.paper, 0.8),
                        transition: "all 0.3s ease",
                        "&:hover": {
                            boxShadow: buildShadows()[4],
                            borderColor: alpha(brand.purple, 0.5),
                        },
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        border: `1px solid ${t.divider}`,
                        boxShadow: buildShadows()[2],
                        borderRadius: tokens.radiusLg,
                        background: alpha(t.paper, 0.9),
                        backdropFilter: "blur(10px)",
                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                            transform: "translateY(-4px)",
                            boxShadow: buildShadows()[6],
                            borderColor: alpha(brand.purple, 0.6),
                            background: alpha(t.paper, 0.95),
                        },
                    },
                },
            },

            // --------- Buttons ---------
            MuiButton: {
                defaultProps: { disableElevation: true },
                styleOverrides: {
                    root: {
                        borderRadius: tokens.radiusLg,
                        paddingInline: 20,
                        paddingBlock: 12,
                        fontWeight: 600,
                        textTransform: "none",
                        fontSize: "15px",
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:focus-visible": { boxShadow: tokens.ring(brand.purple) },
                    },
                    containedPrimary: {
                        background: `linear-gradient(135deg, ${brand.purple} 0%, ${brand.pink} 100%)`,
                        color: "#FFFFFF",
                        boxShadow: buildShadows()[3],
                        position: "relative",
                        overflow: "hidden",
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: "-100%",
                            width: "100%",
                            height: "100%",
                            background: `linear-gradient(90deg, transparent, ${alpha("#FFFFFF", 0.2)}, transparent)`,
                            transition: "left 0.5s ease",
                        },
                        "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: buildShadows()[6],
                            background: `linear-gradient(135deg, ${brand.violet} 0%, ${brand.pink} 100%)`,
                            "&::before": {
                                left: "100%",
                            },
                        },
                        "&:active": {
                            transform: "translateY(0)",
                        },
                    },
                    outlined: {
                        borderWidth: 1.5,
                        borderColor: brand.purple,
                        color: brand.purple,
                        "&:hover": {
                            borderColor: brand.pink,
                            backgroundColor: alpha(brand.purple, 0.15),
                            transform: "translateY(-1px)",
                            boxShadow: `0 4px 12px ${alpha(brand.purple, 0.3)}`,
                        },
                    },
                    text: {
                        color: brand.purple,
                        "&:hover": { 
                            backgroundColor: alpha(brand.purple, 0.15),
                            color: brand.pink,
                        },
                    },
                },
            },

            // --------- Inputs ---------
            MuiTextField: { defaultProps: { variant: "outlined", size: "small" } },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        backgroundColor: alpha(t.paper, 0.6),
                        borderRadius: tokens.radiusLg,
                        backdropFilter: "blur(10px)",
                        "& fieldset": { borderColor: t.divider },
                        "&:hover fieldset": { borderColor: alpha(brand.purple, 0.6) },
                        "&.Mui-focused fieldset": { borderColor: brand.purple },
                        "&.Mui-focused": { 
                            boxShadow: tokens.ring(brand.purple),
                            backgroundColor: alpha(t.paper, 0.8),
                        },
                    },
                    input: { paddingBlock: 10 },
                    notchedOutline: { borderWidth: 1 },
                },
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: { 
                        color: t.textSec, 
                        "&.Mui-focused": { 
                            color: brand.purple,
                            textShadow: `0 0 8px ${alpha(brand.purple, 0.5)}`,
                        },
                    },
                },
            },
            MuiSelect: {
                styleOverrides: {
                    select: { paddingBlock: 10 },
                    icon: { color: t.textSec },
                },
            },
            MuiFormHelperText: {
                styleOverrides: { root: { marginLeft: 0, color: t.textSec } },
            },

            // --------- Chips ---------
            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: 16,
                        height: 32,
                        fontWeight: 500,
                        fontSize: "13px",
                        backgroundColor: alpha(t.paper, 0.5),
                        border: `1px solid ${t.divider}`,
                        backdropFilter: "blur(10px)",
                        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                        "&:hover": {
                            transform: "translateY(-1px)",
                            borderColor: brand.purple,
                            backgroundColor: alpha(brand.purple, 0.2),
                            boxShadow: `0 2px 8px ${alpha(brand.purple, 0.3)}`,
                        },
                    },
                    colorPrimary: {
                        backgroundColor: alpha(brand.purple, 0.2),
                        color: brand.purple,
                        borderColor: alpha(brand.purple, 0.4),
                        "&:hover": {
                            backgroundColor: alpha(brand.purple, 0.3),
                        },
                    },
                    colorSuccess: {
                        backgroundColor: alpha(brand.green, 0.2),
                        color: brand.green,
                        borderColor: alpha(brand.green, 0.4),
                    },
                },
            },

            // --------- Tooltips ---------
            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        borderRadius: 10,
                        background: mode === "light" ? "rgba(17,17,17,0.92)" : "rgba(0,0,0,0.92)",
                        color: "#F8FAFC",
                        border: `1px solid ${alpha("#000", 0.12)}`,
                        padding: "8px 10px",
                        fontSize: 12.5,
                    },
                },
            },

            // --------- Accordion ---------
            MuiAccordion: {
                styleOverrides: {
                    root: {
                        borderRadius: tokens.radiusLg,
                        border: `2px solid ${t.divider}`,
                        boxShadow: buildShadows()[1],
                        background: t.paper,
                        "&:before": { display: "none" },
                        "&.Mui-expanded": {
                            borderRadius: tokens.radiusLg,
                        },
                    },
                },
            },
            MuiAccordionSummary: {
                styleOverrides: {
                    root: {
                        borderRadius: tokens.radiusLg,
                        minHeight: 48,
                        padding: "0 16px",
                        "&.Mui-expanded": {
                            minHeight: 48,
                            borderRadius: `${tokens.radiusLg}px ${tokens.radiusLg}px 0 0`,
                        },
                        "&:hover": {
                            backgroundColor: alpha(brand.blue, 0.04),
                        },
                    },
                },
            },
            MuiAccordionDetails: {
                styleOverrides: {
                    root: {
                        padding: "16px",
                        borderRadius: `0 0 ${tokens.radiusLg}px ${tokens.radiusLg}px`,
                    },
                },
            },

            // --------- Dividers & Lists ---------
            MuiDivider: { styleOverrides: { root: { borderColor: t.divider } } },
            MuiListItemText: {
                styleOverrides: {
                    root: { margin: 0 },
                    primary: { fontWeight: 600 },
                    secondary: { color: t.textSec },
                },
            },

            // --------- Progress ---------
            MuiLinearProgress: {
                styleOverrides: {
                    root: { 
                        height: 8, 
                        borderRadius: 999, 
                        backgroundColor: alpha(t.divider, 0.3),
                        boxShadow: `inset 0 2px 4px ${alpha("#000", 0.2)}`,
                    },
                    bar: { 
                        borderRadius: 999,
                        background: `linear-gradient(90deg, ${brand.purple} 0%, ${brand.pink} 50%, ${brand.cyan} 100%)`,
                        boxShadow: `0 0 15px ${alpha(brand.purple, 0.6)}`,
                        position: "relative",
                        overflow: "hidden",
                        "&::after": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: "-100%",
                            width: "100%",
                            height: "100%",
                            background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
                            animation: "shimmer 2s infinite",
                        },
                    },
                },
            },
            MuiCircularProgress: {
                styleOverrides: {
                    root: { strokeLinecap: "round" as const },
                },
            },

            // --------- Links ---------
            MuiLink: {
                styleOverrides: {
                    root: {
                        color: brand.purple,
                        textUnderlineOffset: "3px",
                        transition: "all 0.2s ease",
                        "&:hover": { 
                            color: brand.pink,
                            textShadow: `0 0 8px ${alpha(brand.pink, 0.5)}`,
                        },
                    },
                },
            },

            // --------- Alerts / Snackbar ---------
            MuiAlert: {
                styleOverrides: {
                    root: {
                        borderRadius: tokens.radiusLg,
                        border: `1px solid ${t.divider}`,
                        backgroundColor: t.paper,
                    },
                    standardSuccess: { borderColor: alpha(brand.green, 0.3) },
                    standardError:   { borderColor: alpha(brand.red,   0.3) },
                    standardWarning: { borderColor: alpha(brand.orange,0.3) },
                    standardInfo:    { borderColor: alpha(brand.blue,  0.3) },
                },
            },
            MuiSnackbarContent: {
                styleOverrides: {
                    root: {
                        borderRadius: tokens.radiusLg,
                        boxShadow: buildShadows()[4],
                    },
                },
            },

            // --------- Tables / Data density (если понадобится история/списки) ---------
            MuiTableContainer: {
                styleOverrides: {
                    root: {
                        borderRadius: tokens.radiusLg,
                        border: `1px solid ${t.divider}`,
                    },
                },
            },
            MuiTableCell: {
                styleOverrides: {
                    root: { borderColor: t.divider },
                    head: { fontWeight: 700 },
                },
            },

            // --------- Tabs (аккуратный индикатор) ---------
            MuiTabs: {
                styleOverrides: {
                    indicator: {
                        height: 2,
                        borderRadius: 2,
                    },
                },
            },
            MuiTab: {
                styleOverrides: {
                    root: {
                        textTransform: "none",
                        fontWeight: 600,
                        "&.Mui-selected": { color: brand.blue },
                    },
                },
            },
        },
    });

    // Чуть-чуть адаптивной типографики
    return responsiveFontSizes(base, { factor: 2 / 3 });
}

// Темная тема Solana по умолчанию
const theme = createAppTheme("dark");

// Добавляем глобальные анимации
const globalStyles = `
    @keyframes shimmer {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
    }
    
    @keyframes spark {
        0%, 100% { opacity: 0; transform: scale(0); }
        50% { opacity: 1; transform: scale(1); }
    }
    
    @keyframes glow-pulse {
        0%, 100% { 
            filter: drop-shadow(0 0 20px rgba(153, 69, 255, 0.5));
        }
        50% { 
            filter: drop-shadow(0 0 30px rgba(153, 69, 255, 0.8)) drop-shadow(0 0 40px rgba(255, 107, 157, 0.6));
        }
    }
`;

// Применяем глобальные стили через MUI
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = globalStyles;
    document.head.appendChild(style);
}

export default theme;
