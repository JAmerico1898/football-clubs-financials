import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Almanaque Financeiro da Série A - 2025",
  description: "Explore as finanças dos clubes do Brasileirão",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <div className="animate-fade-in">{children}</div>
      </body>
    </html>
  );
}
