import BackButton from "@/components/BackButton";

export default function AnaliseIndividualHistorica() {
  return (
    <>
      {/* Fixed grass background + light green overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src="/grass-bg.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 light-page-bg-overlay" />
      </div>

      <main className="relative z-10 max-w-[800px] mx-auto px-4 py-8">
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
    </>
  );
}
