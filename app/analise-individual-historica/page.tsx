import BackButton from "@/components/BackButton";

export default function AnaliseIndividualHistorica() {
  return (
    <main className="max-w-[800px] mx-auto px-4 py-8">
      <BackButton />
      <div className="text-center mt-16">
        <h1
          className="text-3xl font-bold tracking-tight mb-4"
          style={{ color: "var(--text-primary)" }}
        >
          Analise Individual - Historica
        </h1>
        <p style={{ color: "var(--text-secondary)" }}>Em breve</p>
      </div>
    </main>
  );
}
