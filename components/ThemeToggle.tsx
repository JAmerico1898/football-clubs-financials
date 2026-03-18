"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/useTheme";

export default function ThemeToggle() {
  const { dark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={dark ? "Ativar modo claro" : "Ativar modo escuro"}
      className="fixed top-3 right-3 sm:top-4 sm:right-4 z-50
                 w-9 h-9 sm:w-10 sm:h-10 rounded-full
                 flex items-center justify-center
                 shadow-md backdrop-blur transition-colors
                 bg-white/80 hover:bg-white dark:bg-slate-800/80 dark:hover:bg-slate-800"
    >
      {dark ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-600" />}
    </button>
  );
}
