import Image from "next/image";
import NavCard from "@/components/NavCard";
import { routes } from "@/lib/routes";

export default function FrontPage() {
  return (
    <>
      <div className="h-1 w-full bg-gradient-to-r from-brand-blue via-brand-gold to-brand-green" />

      <main className="max-w-[960px] mx-auto px-4 py-12">
        <div className="flex flex-col items-center mb-10">
          <Image
            src="/brasileirao-logo.jpg"
            alt="Brasileirao"
            width={120}
            height={120}
            className="rounded-full shadow-md mb-6"
            priority
          />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center">
            Almanaque Financeiro da Série A 2024
          </h1>
          <p className="mt-3 text-gray-500 text-center max-w-md">
            Explore as finanças dos clubes do Brasileirão
          </p>
          <div className="mt-6 h-px w-48 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {routes.map((route) => (
            <NavCard key={route.href} route={route} />
          ))}
        </div>
      </main>
    </>
  );
}
