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
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr style={{ backgroundColor: "#1565C0" }}>
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
              className="hover:bg-blue-50 transition-colors"
              style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#F5F5F5" }}
            >
              <td className="px-3 py-2 text-center">{i + 1}</td>
              <td className="px-3 py-2 text-left">
                <span className="flex items-center gap-2 whitespace-nowrap">
                  {iconMap[d.club] && (
                    <Image
                      src={iconMap[d.club]}
                      alt={d.club}
                      width={24}
                      height={24}
                    />
                  )}
                  {d.club}
                </span>
              </td>
              <td className="px-3 py-2 text-center">{d.nivel1.toFixed(1)}</td>
              <td className="px-3 py-2 text-center">{d.nivel2.toFixed(1)}</td>
              <td className="px-3 py-2 text-center">{d.nivel3.toFixed(1)}</td>
              <td
                className="px-3 py-2 text-center font-bold"
                style={{ backgroundColor: i % 2 === 0 ? "#E3F2FD" : "#BBDEFB" }}
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
