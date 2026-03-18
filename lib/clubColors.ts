type ColorName = "Red" | "Gray" | "Blue" | "Green" | "Black" | "Yellow" | "Golden";

const colorTones: Record<ColorName, { dark: string; light: string }> = {
  Red:    { dark: "#C0392B", light: "#E74C3C" },
  Gray:   { dark: "#616161", light: "#BDBDBD" },
  Blue:   { dark: "#1565C0", light: "#42A5F5" },
  Green:  { dark: "#2E7D32", light: "#66BB6A" },
  Black:  { dark: "#212121", light: "#757575" },
  Yellow: { dark: "#F9A825", light: "#FFF176" },
  Golden: { dark: "#BF8C00", light: "#FFD54F" },
};

const clubPrimaryColor: Record<string, ColorName> = {
  "Vasco":         "Black",
  "Athletico":     "Red",
  "Atlético":      "Gray",
  "Atlético GO":   "Red",
  "Bahia":         "Blue",
  "Botafogo":      "Gray",
  "Corinthians":   "Gray",
  "Criciúma":      "Yellow",
  "Cruzeiro":      "Blue",
  "Cuiabá":        "Golden",
  "Flamengo":      "Red",
  "Fluminense":    "Green",
  "Fortaleza":     "Blue",
  "Grêmio":        "Blue",
  "Internacional": "Red",
  "Juventude":     "Green",
  "Palmeiras":     "Green",
  "São Paulo":     "Red",
  "Vitória":       "Red",
  "Ceará":         "Black",
  "Mirassol":      "Yellow",
  "Santos":        "Black",
  "Sport":         "Red",
};

export function resolveClubColors(
  club1Name: string,
  club2Name: string,
): { color1: string; color2: string } {
  const c1 = clubPrimaryColor[club1Name] ?? "Gray";
  const c2 = clubPrimaryColor[club2Name] ?? "Gray";

  if (c1 !== c2) {
    return { color1: colorTones[c1].dark, color2: colorTones[c2].dark };
  }
  return { color1: colorTones[c1].dark, color2: colorTones[c1].light };
}
