import Image from "next/image";
import NavCard from "@/components/NavCard";
import { routes } from "@/lib/routes";

export default function FrontPage() {
  return (
    <main className="max-w-[960px] mx-auto px-4 py-12">
      <div className="flex flex-col items-center mb-10">
        <Image
          src="/brasileirao-logo.jpg"
          alt="Brasileirao"
          width={156}
          height={156}
          className="drop-shadow-md mb-6"
          priority
        />
        <h1 className="text-4xl font-bold tracking-tight text-center" style={{ color: "var(--text-primary)" }}>
          Almanaque Financeiro da Série A - 2025
        </h1>
        <p className="mt-3 text-lg text-center max-w-md" style={{ color: "var(--text-secondary)" }}>
          Explore as finanças dos clubes do Brasileirão
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {routes.map((route) => (
          <NavCard key={route.href} route={route} />
        ))}
      </div>

      {/* Hidden visit counter */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Ffinancials-football-clubs.vercel.app&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=visits&edge_flat=false"
        alt=""
        style={{ display: "none" }}
      />
    </main>
  );
}
