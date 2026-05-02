import Image from "next/image";
import ModuleNavbar from "@/components/ModuleNavbar";
import { allDefinitions, glossaryGroups, slugifyTerm } from "@/lib/glossary";

export const metadata = {
  title: "Glossário · Almanaque Financeiro",
  description:
    "Definições dos termos financeiros e esportivos utilizados no Almanaque Financeiro da Série A.",
};

export default function GlossarioPage() {
  return (
    <>
      {/* Fixed grass background + light overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Image
          src="/grass-bg.jpg"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 light-page-bg-overlay" />
      </div>

      <main className="relative z-10 max-w-[1200px] mx-auto px-4 py-8">
        <ModuleNavbar />

        <h1
          className="text-3xl font-bold tracking-tight text-center mb-1"
          style={{ color: "var(--text-primary)" }}
        >
          Glossário
        </h1>
        <p
          className="text-sm text-center mb-8 max-w-2xl mx-auto leading-relaxed"
          style={{ color: "var(--text-secondary)" }}
        >
          Definições dos termos financeiros e esportivos utilizados no
          Almanaque Financeiro da Série A.
        </p>

        <div className="space-y-6">
          {glossaryGroups.map((group) => (
            <section
              key={group.id}
              id={group.id}
              className="card-surface"
              aria-labelledby={`${group.id}-heading`}
            >
              <h2
                id={`${group.id}-heading`}
                className="text-xl font-bold mb-4"
                style={{ color: "var(--text-primary)" }}
              >
                {group.label}
              </h2>
              <dl className="space-y-3 text-sm" style={{ color: "var(--text-secondary)" }}>
                {group.terms.map((term) => {
                  const definition = allDefinitions[term];
                  if (!definition) return null;
                  const anchor = slugifyTerm(term);
                  return (
                    <div key={term} id={anchor}>
                      <dt className="inline font-bold" style={{ color: "var(--text-primary)" }}>
                        {term}:
                      </dt>{" "}
                      <dd className="inline">{definition}</dd>
                    </div>
                  );
                })}
              </dl>
            </section>
          ))}
        </div>
      </main>
    </>
  );
}
