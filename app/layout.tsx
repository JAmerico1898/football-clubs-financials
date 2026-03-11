import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Almanaque Financeiro da Série A 2024",
  description: "Explore as finanças dos clubes do Brasileirão",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
