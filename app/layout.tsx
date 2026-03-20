import type { Metadata } from "next";
import { Inter, Public_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-public-sans",
  weight: ["300", "400", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Almanaque Financeiro da Série A - 2025",
  description: "Explore as finanças dos clubes do Brasileirão",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${publicSans.variable} ${inter.className}`}>
        <div className="animate-fade-in">{children}</div>
      </body>
    </html>
  );
}
