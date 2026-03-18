import BackButton from "@/components/BackButton";

export default function SustentabilidadeFinanceiraPage() {
  return (
    <main className="max-w-[960px] mx-auto px-4 py-12">
      <BackButton />
      <h1
        className="text-3xl font-bold tracking-tight mb-4"
        style={{ color: "var(--text-primary)" }}
      >
        Sistema de Sustentabilidade Financeira
      </h1>
      <p style={{ color: "var(--text-secondary)" }}>
        Simulador do regulamento de Fair Play Financeiro — em breve.
      </p>
    </main>
  );
}
