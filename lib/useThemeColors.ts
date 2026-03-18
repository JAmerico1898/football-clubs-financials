"use client";

import { useEffect, useState } from "react";

export interface ThemeColors {
  textPrimary: string;
  textSecondary: string;
  background: string;
  surface: string;
  border: string;
  brandBlue: string;
  brandGold: string;
  brandGreen: string;
  brandRed: string;
}

const DEFAULTS: ThemeColors = {
  textPrimary: "#0f172a",
  textSecondary: "#64748b",
  background: "#f8fafc",
  surface: "#ffffff",
  border: "#e2e8f0",
  brandBlue: "#1565C0",
  brandGold: "#F9A825",
  brandGreen: "#2E7D32",
  brandRed: "#C62828",
};

function resolve(): ThemeColors {
  if (typeof window === "undefined") return DEFAULTS;
  const s = getComputedStyle(document.documentElement);
  const g = (v: string, fallbackKey: keyof ThemeColors) => s.getPropertyValue(v).trim() || DEFAULTS[fallbackKey];
  return {
    textPrimary: g("--text-primary", "textPrimary"),
    textSecondary: g("--text-secondary", "textSecondary"),
    background: g("--background", "background"),
    surface: g("--surface", "surface"),
    border: g("--border", "border"),
    brandBlue: g("--brand-blue", "brandBlue"),
    brandGold: g("--brand-gold", "brandGold"),
    brandGreen: g("--brand-green", "brandGreen"),
    brandRed: g("--brand-red", "brandRed"),
  };
}

export function useThemeColors(): ThemeColors {
  const [colors, setColors] = useState<ThemeColors>(DEFAULTS);

  useEffect(() => {
    setColors(resolve());
  }, []);

  return colors;
}
