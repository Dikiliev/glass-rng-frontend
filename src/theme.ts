// Apple-like light theme for MUI v7
import { createTheme, alpha, responsiveFontSizes } from "@mui/material/styles";

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

// iOS / macOS accent & feedback colors
const brand = {
    blue:    "#0A84FF", // iOS accent
    green:   "#34C759",
    orange:  "#FF9F0A",
    red:     "#FF3B30",
    purple:  "#5856D6",
    grayBg:  "#F5F5F7", // system grouped bg
    grayDiv: "#E5E5EA", // separator
    textPri: "#111111",
    textSec: "#6e6e73",
};

const base = createTheme({
    palette: {
        mode: "light",
        primary:   { main: "#111111" },
        secondary: { main: brand.purple },
        success:   { main: brand.green },
        warning:   { main: brand.orange },
        error:     { main: brand.red },
        info:      { main: "#64D2FF" },
        background: {
            default: brand.grayBg,
            paper:   "#FFFFFF",
        },
        divider: brand.grayDiv,
        text: {
            primary:   brand.textPri,
            secondary: brand.textSec,
        },
    },
    shape: { borderRadius: 12 },
    typography: {
        fontFamily: FONT_SANS,
        fontWeightRegular: 400,
        fontWeightMedium: 600,
        fontWeightBold: 700,
        h1: { fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700, letterSpacing: -0.2 },
        h2: { fontSize: "clamp(24px, 3vw, 32px)", fontWeight: 700, letterSpacing: -0.15 },
        h3: { fontSize: 24, fontWeight: 700 },
        h4: { fontSize: 20, fontWeight: 700 },
        h5: { fontSize: 18, fontWeight: 700 },
        h6: { fontSize: 16, fontWeight: 700 },
        subtitle1: { fontSize: 14, fontWeight: 600, color: brand.textSec },
        body1: { fontSize: 15, lineHeight: 1.55 },
        body2: { fontSize: 14, lineHeight: 1.5, color: brand.textSec },
        button: { textTransform: "none", fontWeight: 700, letterSpacing: 0.2 },
        overline: { textTransform: "none", fontSize: 12, letterSpacing: 0.2, color: brand.textSec },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                html: { height: "100%" },
                body: {
                    minHeight: "100%",
                    backgroundColor: brand.grayBg,
                    WebkitFontSmoothing: "antialiased",
                    MozOsxFontSmoothing: "grayscale",
                },
                a: { color: brand.blue, textDecorationThickness: "1px", textUnderlineOffset: "3px" },
                "::selection": { background: alpha(brand.blue, 0.18) },
                code: {
                    fontFamily: FONT_MONO,
                    background: "#F2F2F7",
                    borderRadius: 8,
                    padding: "0.12rem 0.35rem",
                },
                pre: {
                    fontFamily: FONT_MONO,
                    background: "#F2F2F7",
                    border: `1px solid ${brand.grayDiv}`,
                    borderRadius: 12,
                    padding: "12px 14px",
                    overflow: "auto",
                },
                "*::-webkit-scrollbar": { height: 8, width: 10 },
                "*::-webkit-scrollbar-thumb": {
                    background: alpha("#9BA0A6", 0.45),
                    borderRadius: 999,
                },
            },
        },

        // Cards / Paper — плоско, с лёгкой тенью и тонкой рамкой
        MuiPaper: {
            defaultProps: { elevation: 0, variant: "outlined" },
            styleOverrides: {
                root: { backgroundImage: "none" },
                outlined: {
                    border: `1px solid ${brand.grayDiv}`,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    border: `1px solid ${brand.grayDiv}`,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                },
            },
        },

        // Buttons — акцентные, без лишнего блеска
        MuiButton: {
            defaultProps: { disableElevation: true },
            styleOverrides: {
                root: { borderRadius: 12, paddingInline: 14 },
            },
        },

        // Inputs — мягкие, округлые, с «focus ring»
        MuiTextField: { defaultProps: { variant: "outlined", size: "small" } },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    backgroundColor: "#FFFFFF",
                    "& fieldset": { borderColor: brand.grayDiv },
                    "&:hover fieldset": { borderColor: alpha(brand.blue, 0.6) },
                    "&.Mui-focused fieldset": { borderColor: brand.blue },
                    "&.Mui-focused": {
                        boxShadow: `0 0 0 3px ${alpha(brand.blue, 0.15)}`,
                        borderRadius: 12,
                    },
                },
                input: { paddingBlock: 10 },
            },
        },

        // Chips — мягкие пилюли
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 999,
                    backgroundColor: "#F2F2F7",
                    border: `1px solid ${brand.grayDiv}`,
                },
                colorPrimary: {
                    backgroundColor: alpha(brand.blue, 0.12),
                    color: "#0B3A7E",
                    borderColor: alpha(brand.blue, 0.24),
                },
                colorSuccess: {
                    backgroundColor: alpha(brand.green, 0.12),
                    color: "#0B4D2A",
                    borderColor: alpha(brand.green, 0.24),
                },
            },
        },

        // Tooltips — компактные, тёмные
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    borderRadius: 10,
                    background: "rgba(17,17,17,0.92)",
                    color: "#F8FAFC",
                    border: `1px solid ${alpha("#000", 0.1)}`,
                },
            },
        },

        // Dividers и Lists — тонко и аккуратно
        MuiDivider: {
            styleOverrides: { root: { borderColor: brand.grayDiv } },
        },
        MuiListItemText: {
            styleOverrides: {
                root: { margin: 0 },
                primary: { fontWeight: 600 },
                secondary: { color: brand.textSec },
            },
        },

        // Progress — тонкая полоска
        MuiLinearProgress: {
            styleOverrides: {
                root: { height: 6, borderRadius: 999, backgroundColor: "#EDEEF0" },
                bar: { borderRadius: 999 },
            },
        },

        // Links
        MuiLink: {
            styleOverrides: {
                root: {
                    color: brand.blue,
                    textUnderlineOffset: "3px",
                    "&:hover": { color: "#0077EE" },
                },
            },
        },

        // Alerts / Snackbar — мягкие карточки
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    border: `1px solid ${brand.grayDiv}`,
                    backgroundColor: "#FFFFFF",
                },
            },
        },
    },
});

// чуть-чуть адаптивной типографики
const theme = responsiveFontSizes(base, { factor: 2/3 });
export default theme;
