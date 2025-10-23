// theme.ts — Apple-like design for MUI v7
// Senior-crafted: чистые отступы, продуманная типографика, мягкие тени, focus ring, единые токены.

import { createTheme, alpha, responsiveFontSizes } from "@mui/material/styles";

// ---------- Fonts ----------
const FONT_SANS = [
    '-apple-system',
    'BlinkMacSystemFont',
    '"SF Pro Text"',
    '"SF Pro Display"',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'system-ui',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
].join(', ');

const FONT_MONO = [
    '"SFMono-Regular"',
    'Menlo',
    'Monaco',
    'Consolas',
    '"Liberation Mono"',
    '"Courier New"',
    'monospace',
].join(', ');

// ---------- Design Tokens ----------
const tokens = {
    radius: 12,
    radiusLg: 16,
    ring: (hex: string) => `0 0 0 3px ${alpha(hex, 0.16)}`,
    // iOS/macOS-подобные цвета
    brand: {
        blue:   "#0A84FF",
        green:  "#34C759",
        orange: "#FF9F0A",
        red:    "#FF3B30",
        purple: "#5856D6",
    },
    light: {
        bg:        "#F5F5F7",
        paper:     "#FFFFFF",
        divider:   "#E5E5EA",
        textPri:   "#111111",
        textSec:   "#6E6E73",
        codeBg:    "#F2F2F7",
        scrollbar: "#9BA0A6",
    },
    dark: {
        bg:        "#0F1113",
        paper:     "#121416",
        divider:   "#23262A",
        textPri:   "#F5F6F7",
        textSec:   "#A4A8AE",
        codeBg:    "#1A1D21",
        scrollbar: "#737A81",
    }
};

// ---------- Subtle Shadows (персонально настроенные) ----------
const buildShadows = (mode: "light" | "dark"): string[] => {
    const base = mode === "light"
        ? ["rgba(0,0,0,0.06)", "rgba(0,0,0,0.12)"]
        : ["rgba(0,0,0,0.5)",  "rgba(0,0,0,0.6)"];
    const s = (y: number, b = 10) => `0 ${y}px ${y + b}px ${alpha(base[0], 1)}`;
    const s2 = (y: number, b = 10) => `0 ${Math.max(1, y - 1)}px ${y + b}px ${alpha(base[1], 1)}`;

    // 25 слоёв как в MUI, но все — мягкие и короткие
    return [
        "none",
        `${s(1, 4)}, ${s2(1, 6)}`,
        `${s(2, 6)}, ${s2(2, 8)}`,
        `${s(3, 8)}, ${s2(3,10)}`,
        `${s(4, 9)}, ${s2(4,12)}`,
        `${s(5,10)}, ${s2(5,14)}`,
        `${s(6,11)}, ${s2(6,16)}`,
        `${s(7,12)}, ${s2(7,18)}`,
        `${s(8,12)}, ${s2(8,20)}`,
        `${s(9,13)}, ${s2(9,22)}`,
        `${s(10,14)}, ${s2(10,24)}`,
        `${s(11,14)}, ${s2(11,26)}`,
        `${s(12,15)}, ${s2(12,28)}`,
        `${s(13,15)}, ${s2(13,30)}`,
        `${s(14,16)}, ${s2(14,32)}`,
        `${s(15,16)}, ${s2(15,34)}`,
        `${s(16,17)}, ${s2(16,36)}`,
        `${s(17,17)}, ${s2(17,38)}`,
        `${s(18,18)}, ${s2(18,40)}`,
        `${s(19,18)}, ${s2(19,42)}`,
        `${s(20,19)}, ${s2(20,44)}`,
        `${s(21,19)}, ${s2(21,46)}`,
        `${s(22,20)}, ${s2(22,48)}`,
        `${s(23,20)}, ${s2(23,50)}`,
        `${s(24,21)}, ${s2(24,52)}`,
    ];
};

// ---------- Theme Factory ----------
export function createAppTheme(mode: "light" | "dark" = "light") {
    const t = tokens[mode];
    const brand = tokens.brand;

    const base = createTheme({
        palette: {
            mode,
            primary:   { main: mode === "light" ? "#111111" : "#EDEEF0" },
            secondary: { main: brand.purple },
            success:   { main: brand.green },
            warning:   { main: brand.orange },
            error:     { main: brand.red },
            info:      { main: mode === "light" ? "#64D2FF" : "#5AC8F5" },
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
                hover: alpha(brand.blue, mode === "light" ? 0.06 : 0.08),
                selected: alpha(brand.blue, mode === "light" ? 0.1 : 0.14),
                focus: alpha(brand.blue, 0.16),
                disabled: alpha(t.textPri, 0.32),
                disabledBackground: alpha(t.textPri, 0.06),
            },
        },

        shape: { borderRadius: tokens.radius },

        typography: {
            fontFamily: FONT_SANS,
            fontWeightRegular: 400,
            fontWeightMedium: 600,
            fontWeightBold: 700,
            // Apple-like scale (чуть плотнее, клэмпы для адаптива)
            h1: { fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, letterSpacing: -0.2, lineHeight: 1.18 },
            h2: { fontSize: "clamp(24px, 3.2vw, 32px)", fontWeight: 700, letterSpacing: -0.15, lineHeight: 1.2 },
            h3: { fontSize: 24, fontWeight: 700, letterSpacing: -0.1, lineHeight: 1.22 },
            h4: { fontSize: 20, fontWeight: 700, letterSpacing: -0.08, lineHeight: 1.24 },
            h5: { fontSize: 18, fontWeight: 700, letterSpacing: -0.04, lineHeight: 1.28 },
            h6: { fontSize: 16, fontWeight: 700, letterSpacing: 0, lineHeight: 1.32 },
            subtitle1: { fontSize: 14, fontWeight: 600, color: t.textSec, lineHeight: 1.4 },
            body1: { fontSize: 15, lineHeight: 1.55 },
            body2: { fontSize: 14, lineHeight: 1.5, color: t.textSec },
            button: { textTransform: "none", fontWeight: 700, letterSpacing: 0.2 },
            overline: { textTransform: "none", fontSize: 12, letterSpacing: 0.2, color: t.textSec },
            caption: { fontSize: 12, color: t.textSec, lineHeight: 1.4 },
        },

        shadows: buildShadows(mode),

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
                    html: { height: "100%" },
                    body: {
                        minHeight: "100%",
                        backgroundColor: t.bg,
                        WebkitFontSmoothing: "antialiased",
                        MozOsxFontSmoothing: "grayscale",
                        textRendering: "optimizeLegibility",
                    },
                    a: {
                        color: brand.blue,
                        textDecorationThickness: "1px",
                        textUnderlineOffset: "3px",
                    },
                    "::selection": { background: alpha(brand.blue, 0.18) },
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
                    // Subtle focus ring для всех фокусируемых
                    "*:focus-visible": {
                        outline: "none",
                        boxShadow: tokens.ring(brand.blue),
                        borderRadius: tokens.radius,
                    },
                },
            },

            // --------- Surfaces ---------
            MuiPaper: {
                defaultProps: { elevation: 0, variant: "outlined" },
                styleOverrides: {
                    root: { backgroundImage: "none" },
                    outlined: {
                        border: `1px solid ${t.divider}`,
                        boxShadow: mode === "light"
                            ? "0 1px 2px rgba(0,0,0,0.06)"
                            : "0 1px 2px rgba(0,0,0,0.5)",
                        borderRadius: tokens.radiusLg,
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        border: `1px solid ${t.divider}`,
                        boxShadow: mode === "light"
                            ? "0 1px 2px rgba(0,0,0,0.06)"
                            : "0 1px 2px rgba(0,0,0,0.5)",
                        borderRadius: tokens.radiusLg,
                    },
                },
            },

            // --------- Buttons ---------
            MuiButton: {
                defaultProps: { disableElevation: true },
                styleOverrides: {
                    root: {
                        borderRadius: tokens.radiusLg,
                        paddingInline: 14,
                        fontWeight: 700,
                        "&:focus-visible": { boxShadow: tokens.ring(brand.blue) },
                    },
                    containedPrimary: {
                        backgroundColor: mode === "light" ? "#111111" : "#EDEEF0",
                        color: mode === "light" ? "#FFFFFF" : "#111111",
                        "&:hover": {
                            backgroundColor: mode === "light" ? "#1A1A1A" : "#F2F3F5",
                        },
                    },
                    outlined: {
                        borderColor: t.divider,
                        "&:hover": {
                            borderColor: alpha(brand.blue, 0.6),
                            backgroundColor: alpha(brand.blue, 0.06),
                        },
                    },
                    text: {
                        "&:hover": { backgroundColor: alpha(brand.blue, 0.06) },
                    },
                },
            },

            // --------- Inputs ---------
            MuiTextField: { defaultProps: { variant: "outlined", size: "small" } },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        backgroundColor: t.paper,
                        borderRadius: tokens.radiusLg,
                        "& fieldset": { borderColor: t.divider },
                        "&:hover fieldset": { borderColor: alpha(brand.blue, 0.6) },
                        "&.Mui-focused fieldset": { borderColor: brand.blue },
                        "&.Mui-focused": { boxShadow: tokens.ring(brand.blue) },
                    },
                    input: { paddingBlock: 10 },
                    notchedOutline: { borderWidth: 1 },
                },
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: { color: t.textSec, "&.Mui-focused": { color: brand.blue } },
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
                        borderRadius: 999,
                        backgroundColor: mode === "light" ? "#F2F2F7" : "#1A1D21",
                        border: `1px solid ${t.divider}`,
                    },
                    colorPrimary: {
                        backgroundColor: alpha(brand.blue, 0.12),
                        color: mode === "light" ? "#0B3A7E" : "#9ED0FF",
                        borderColor: alpha(brand.blue, 0.24),
                    },
                    colorSuccess: {
                        backgroundColor: alpha(brand.green, 0.12),
                        color: mode === "light" ? "#0B4D2A" : "#9AE6B4",
                        borderColor: alpha(brand.green, 0.24),
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
                    root: { height: 6, borderRadius: 999, backgroundColor: mode === "light" ? "#EDEEF0" : "#1E2226" },
                    bar: { borderRadius: 999 },
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
                        color: brand.blue,
                        textUnderlineOffset: "3px",
                        "&:hover": { color: mode === "light" ? "#0077EE" : "#66C4FF" },
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
                        boxShadow: buildShadows(mode)[4],
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

// Светлая тема по умолчанию
const theme = createAppTheme("light");
export default theme;
