// src/theme.ts
import { createTheme, alpha, type ThemeOptions } from "@mui/material/styles";

// --- Базовые цвета бренда (стекло + неон) ---
const brand = {
    primary: "#22D3EE",   // cyan-400 (акцент / действия)
    secondary: "#A78BFA", // violet-400 (вторичный акцент)
    success: "#10B981",   // emerald
    warning: "#F59E0B",   // amber
    error:   "#EF4444",   // red
    info:    "#60A5FA",   // blue-400
};

const fontSans =
    '"Inter var", Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';
const fontMono =
    '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace';

// --- Генератор темы: light/dark ---
export function getTheme(mode: "light" | "dark" = "dark") {
    const isDark = mode === "dark";

    const backgroundGradient = isDark
        ? "radial-gradient(1200px 600px at 80% -10%, rgba(34,211,238,0.12), transparent 40%), radial-gradient(900px 500px at 20% 120%, rgba(167,139,250,0.12), transparent 40%), #0B0F14"
        : "radial-gradient(1200px 600px at 80% -10%, rgba(34,211,238,0.18), transparent 40%), radial-gradient(900px 500px at 20% 120%, rgba(167,139,250,0.18), transparent 40%), #F7FAFC";

    const commonGlass = {
        surface: isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.7)",
        border: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
        hover:  isDark ? "rgba(255,255,255,0.1)"  : "rgba(255,255,255,0.85)",
        codeBg: isDark ? "rgba(15,23,42,0.7)"     : "rgba(15,23,42,0.06)",
    };

    const options: ThemeOptions = {
        palette: {
            mode,
            primary:   { main: brand.primary },
            secondary: { main: brand.secondary },
            success:   { main: brand.success },
            warning:   { main: brand.warning },
            error:     { main: brand.error },
            info:      { main: brand.info },
            background: {
                default: isDark ? "#0B0F14" : "#FFFFFF",
                paper:   isDark ? "#0D131A" : "#FFFFFF",
            },
            divider: isDark ? alpha("#FFFFFF", 0.12) : alpha("#000000", 0.12),
            text: {
                primary:  isDark ? alpha("#FFFFFF", 0.92) : alpha("#0B1220", 0.92),
                secondary:isDark ? alpha("#FFFFFF", 0.65) : alpha("#0B1220", 0.65),
            },
        },
        shape: {
            borderRadius: 16,
        },
        typography: {
            fontFamily: fontSans,
            fontWeightRegular: 500,
            fontWeightMedium: 600,
            fontWeightBold: 700,
            h1: { fontSize: "clamp(32px, 4vw, 44px)", fontWeight: 700, letterSpacing: -0.5 },
            h2: { fontSize: "clamp(26px, 3vw, 36px)", fontWeight: 700, letterSpacing: -0.3 },
            h3: { fontSize: "clamp(22px, 2.6vw, 28px)", fontWeight: 700 },
            h4: { fontSize: "22px", fontWeight: 700 },
            h5: { fontSize: "18px", fontWeight: 700 },
            h6: { fontSize: "16px", fontWeight: 700, letterSpacing: 0.1 },
            subtitle1: { fontWeight: 600, letterSpacing: 0.2 },
            button: { textTransform: "none", fontWeight: 700, letterSpacing: 0.2 },
            code: { fontFamily: fontMono } as any,
        },
        shadows: [
            "none",
            "0 1px 2px rgba(0,0,0,0.2)",
            "0 4px 12px rgba(0,0,0,0.25)",
            "0 10px 30px rgba(0,0,0,0.35)",
            ...Array(21).fill("0 10px 30px rgba(0,0,0,0.35)"),
        ] as any,
        components: {
            MuiCssBaseline: {
                styleOverrides: {
                    ":root": {
                        "--glass-surface": commonGlass.surface,
                        "--glass-border":  commonGlass.border,
                        "--glass-hover":   commonGlass.hover,
                        "--code-bg":       commonGlass.codeBg,
                    },
                    html: { height: "100%" },
                    body: {
                        minHeight: "100%",
                        background: backgroundGradient,
                        backgroundAttachment: "fixed",
                    },
                    "*": { outlineColor: brand.primary },
                    // аккуратные скроллбары
                    "*::-webkit-scrollbar": { height: 8, width: 10 },
                    "*::-webkit-scrollbar-thumb": {
                        background: alpha("#93C5FD", isDark ? 0.28 : 0.4),
                        borderRadius: 999,
                    },
                    code: {
                        fontFamily: fontMono,
                        background: "var(--code-bg)",
                        borderRadius: 8,
                        padding: "0.15rem 0.35rem",
                    },
                    pre: {
                        fontFamily: fontMono,
                        background: "var(--code-bg)",
                        border: `1px solid ${commonGlass.border}`,
                        borderRadius: 12,
                        padding: "12px 14px",
                    },
                    "::selection": {
                        background: alpha(brand.primary, 0.3),
                    },
                },
            },

            // Бумага/Карточки — стеклянные поверхности
            MuiPaper: {
                styleOverrides: {
                    root: {
                        backgroundImage: "none",
                    },
                    outlined: {
                        backgroundColor: "var(--glass-surface)",
                        border: `1px solid var(--glass-border)`,
                        backdropFilter: "saturate(150%) blur(10px)",
                    },
                    elevation1: {
                        backgroundColor: "var(--glass-surface)",
                        backdropFilter: "saturate(150%) blur(10px)",
                    },
                },
                defaultProps: { elevation: 0, variant: "outlined" },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        border: `1px solid var(--glass-border)`,
                        backgroundColor: "var(--glass-surface)",
                        backdropFilter: "saturate(150%) blur(10px)",
                    },
                },
            },

            MuiButton: {
                styleOverrides: {
                    root: { borderRadius: 12, paddingInline: 14, letterSpacing: 0.2 },
                    containedPrimary: {
                        boxShadow: "0 8px 24px rgba(34,211,238,0.25)",
                    },
                    outlined: {
                        borderColor: alpha(brand.primary, 0.4),
                        "&:hover": { borderColor: brand.primary, backgroundColor: alpha(brand.primary, 0.06) },
                    },
                },
                defaultProps: { disableElevation: true },
            },

            MuiChip: {
                styleOverrides: {
                    root: {
                        borderRadius: 999,
                        backdropFilter: "saturate(180%) blur(8px)",
                        border: `1px solid var(--glass-border)`,
                    },
                    colorDefault: {
                        backgroundColor: alpha("#FFFFFF", isDark ? 0.06 : 0.5),
                    },
                    filled: {
                        backgroundColor: alpha(brand.primary, isDark ? 0.18 : 0.22),
                        color: isDark ? "#E6FBFF" : "#04222A",
                    },
                },
            },

            MuiAlert: {
                styleOverrides: {
                    root: {
                        borderRadius: 14,
                        border: `1px solid var(--glass-border)`,
                        backgroundColor: "var(--glass-surface)",
                        backdropFilter: "saturate(150%) blur(8px)",
                    },
                },
            },

            MuiTooltip: {
                styleOverrides: {
                    tooltip: {
                        borderRadius: 10,
                        background: isDark ? "rgba(15,23,42,0.9)" : "#111827",
                        color: "#F8FAFC",
                        border: `1px solid ${alpha("#FFFFFF", 0.12)}`,
                    },
                },
            },

            MuiListItemText: {
                styleOverrides: {
                    root: { margin: 0 },
                    secondary: { opacity: 0.8, fontFamily: fontMono, fontSize: 12 },
                },
            },

            MuiDivider: {
                styleOverrides: {
                    root: {
                        borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
                    },
                },
            },

            MuiLink: {
                styleOverrides: {
                    root: {
                        color: brand.info,
                        textUnderlineOffset: "3px",
                        "&:hover": { color: alpha(brand.info, 0.85) },
                    },
                },
            },

            MuiLinearProgress: {
                styleOverrides: {
                    root: {
                        height: 8,
                        borderRadius: 999,
                        backgroundColor: alpha("#FFFFFF", isDark ? 0.08 : 0.2),
                    },
                    bar: {
                        borderRadius: 999,
                    },
                },
            },
        },
    };

    return createTheme(options);
}

// Экспорт готовой тёмной темы по умолчанию
const theme = getTheme("dark");
export default theme;
