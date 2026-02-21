// ── 3DMates Brand Tokens ─────────────────────────────────────
// Single source of truth for all brand colors and typography.

export const brand = {
  colors: {
    cyan: "#0FB6C8",
    cyanHover: "#0CA4B5",
    cyanMuted: "#0FB6C820",
    background: "#0B0F14",
    surface: "#141A1F",
    surfaceHover: "#1A2128",
    text: "#E5E7EB",
    muted: "#6B7280",
    border: "#1F2937",
    borderLight: "#374151",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    white: "#FFFFFF",
    black: "#000000",
  },
  typography: {
    fontFamily: "'Satoshi', sans-serif",
  },
} as const;

// Tailwind-friendly color map for extending config
export const tailwindBrandColors = {
  cyan: {
    DEFAULT: brand.colors.cyan,
    hover: brand.colors.cyanHover,
    muted: brand.colors.cyanMuted,
  },
  brand: {
    bg: brand.colors.background,
    surface: brand.colors.surface,
    "surface-hover": brand.colors.surfaceHover,
    text: brand.colors.text,
    muted: brand.colors.muted,
    border: brand.colors.border,
    "border-light": brand.colors.borderLight,
  },
};
