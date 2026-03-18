"use client";

import Image from "next/image";
import { TransparencyDatum } from "./TransparencyChart";

interface Props {
  data: TransparencyDatum[];
  iconMap: Record<string, string>;
}

const HEADERS = [
  { label: "#", align: "text-center" },
  { label: "Clube", align: "text-left" },
  { label: "Nível 1", align: "text-center" },
  { label: "Nível 2", align: "text-center" },
  { label: "Nível 3", align: "text-center" },
  { label: "Índice de Transparência", align: "text-center" },
];

export default function TransparencyTable({ data, iconMap }: Props) {
  return (
    <div className="overflow-x-auto card-surface !p-0">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr style={{ backgroundColor: "var(--brand-blue)" }}>
            {HEADERS.map((h) => (
              <th
                key={h.label}
                className={`px-3 py-2 text-white font-bold whitespace-nowrap ${h.align}`}
              >
                {h.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((d, i) => (
            <tr
              key={d.club}
              className="transition-colors hover:bg-blue-50"
              style={{
                backgroundColor: i % 2 === 0 ? "var(--surface)" : "var(--background)",
              }}
            >
              <td className="px-3 py-2 text-center" style={{ color: "var(--text-primary)" }}>{i + 1}</td>
              <td className="px-3 py-2 text-left" style={{ color: "var(--text-primary)" }}>
                <span className="flex items-center gap-2 whitespace-nowrap">
                  {iconMap[d.club] && (
                    <Image
                      src={iconMap[d.club]}
                      alt={d.club}
                      width={32}
                      height={32}
                      style={{ objectFit: "contain" }}
                    />
                  )}
                  {d.club}
                </span>
              </td>
              <td className="px-3 py-2 text-center" style={{ color: "var(--text-primary)" }}>{d.nivel1.toFixed(1)}</td>
              <td className="px-3 py-2 text-center" style={{ color: "var(--text-primary)" }}>{d.nivel2.toFixed(1)}</td>
              <td className="px-3 py-2 text-center" style={{ color: "var(--text-primary)" }}>{d.nivel3.toFixed(1)}</td>
              <td
                className="px-3 py-2 text-center font-bold"
                style={{
                  color: "var(--text-primary)",
                  backgroundColor: "rgba(21, 101, 192, 0.12)",
                }}
              >
                {d.total.toFixed(1)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
