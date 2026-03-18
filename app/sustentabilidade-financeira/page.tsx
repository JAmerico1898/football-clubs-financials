import BackButton from "@/components/BackButton";

export default function SustentabilidadeFinanceiraPage() {
  return (
    <>
      <div className="h-1 w-full bg-gradient-to-r from-brand-blue via-brand-gold to-brand-green" />
      <main className="max-w-[960px] mx-auto px-4 py-12">
        <BackButton />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Sistema de Sustentabilidade Financeira
        </h1>
        <p className="text-gray-500">
          Simulador do regulamento de Fair Play Financeiro — em breve.
        </p>
      </main>
    </>
  );
}
