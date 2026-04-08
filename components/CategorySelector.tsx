"use client";

import { useEffect, useRef, useState } from "react";
import {
  ALL_CATEGORIES,
  CATEGORY_COLORS,
  MAX_SELECTED,
} from "@/lib/desigualdade-constants";

interface CategorySelectorProps {
  selected: string[];
  setSelected: (cats: string[]) => void;
  activated: boolean;
  setActivated: (v: boolean) => void;
  allCategories?: string[];
  categoryColors?: Record<string, string>;
  maxSelected?: number;
  minSelected?: number;
  defaultDescription?: string;
}

export default function CategorySelector({
  selected,
  setSelected,
  activated,
  setActivated,
  allCategories = ALL_CATEGORIES,
  categoryColors = CATEGORY_COLORS,
  maxSelected = MAX_SELECTED,
  minSelected = 0,
  defaultDescription = "Receita da Atividade Esportiva e Custo da Atividade Esportiva são exibidas por padrão.",
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleActivate() {
    setActivated(true);
    setSelected([]);
    setOpen(true);
  }

  function toggleCategory(cat: string) {
    if (selected.includes(cat)) {
      if (selected.length <= minSelected) return;
      setSelected(selected.filter((c) => c !== cat));
    } else if (selected.length < maxSelected) {
      setSelected([...selected, cat]);
    }
  }

  function removeCategory(cat: string) {
    if (selected.length <= minSelected) return;
    setSelected(selected.filter((c) => c !== cat));
  }

  const atLimit = selected.length >= maxSelected;

  return (
    <div ref={ref} className="relative">
      {!activated ? (
        <div>
          <button
            onClick={handleActivate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-colors"
            style={{
              backgroundColor: "var(--brand-blue)",
              color: "#fff",
            }}
          >
            <span className="material-symbols-outlined text-[20px]">tune</span>
            Personalizar variáveis
          </button>
          <p
            className="text-xs mt-2"
            style={{ color: "var(--text-secondary)" }}
          >
            {defaultDescription}
          </p>
        </div>
      ) : (
        <div>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center justify-between gap-2 w-full px-4 py-2.5 rounded-lg font-medium text-sm border transition-colors"
            style={{
              backgroundColor: "var(--surface)",
              borderColor: "var(--border)",
              color: "var(--text-primary)",
            }}
          >
            <span>
              Variáveis selecionadas ({selected.length}/{maxSelected})
            </span>
            <span
              className="material-symbols-outlined text-[20px] transition-transform"
              style={{ transform: open ? "rotate(180deg)" : undefined }}
            >
              expand_more
            </span>
          </button>

          {/* Dropdown list */}
          {open && (
            <ul
              className="absolute z-20 mt-1 w-full rounded-lg shadow-lg border overflow-hidden"
              style={{
                backgroundColor: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              {allCategories.map((cat) => {
                const isSelected = selected.includes(cat);
                const isDisabled = !isSelected && atLimit;
                const isLastSelected = isSelected && selected.length <= minSelected;

                return (
                  <li key={cat}>
                    <button
                      onClick={() => !isDisabled && toggleCategory(cat)}
                      disabled={isDisabled}
                      title={
                        isDisabled
                          ? `Máximo de ${maxSelected} variáveis atingido`
                          : isLastSelected
                            ? "Selecione ao menos 1 métrica"
                            : undefined
                      }
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-black/5"
                      style={{ color: "var(--text-primary)" }}
                    >
                      <span
                        className="flex items-center justify-center w-4 h-4 rounded border flex-shrink-0"
                        style={{
                          borderColor: categoryColors[cat],
                          backgroundColor: isSelected
                            ? categoryColors[cat]
                            : "transparent",
                        }}
                      >
                        {isSelected && (
                          <span className="material-symbols-outlined text-white text-[14px]">
                            check
                          </span>
                        )}
                      </span>
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: categoryColors[cat] }}
                      />
                      {cat}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Chips */}
          {selected.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selected.map((cat) => {
                const isLast = selected.length <= minSelected;
                return (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: categoryColors[cat] + "18",
                      color: categoryColors[cat],
                      border: `1px solid ${categoryColors[cat]}40`,
                    }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: categoryColors[cat] }}
                    />
                    {cat}
                    <button
                      onClick={() => removeCategory(cat)}
                      className={`ml-0.5 ${isLast ? "opacity-30 cursor-not-allowed" : "hover:opacity-70"}`}
                      title={isLast ? "Selecione ao menos 1 métrica" : undefined}
                      aria-label={`Remover ${cat}`}
                    >
                      ✕
                    </button>
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
