import BackButton from "@/components/BackButton";

export default function AnaliseIndividualHistorica() {
  return (
    <main className="max-w-[800px] mx-auto px-4 py-8">
      <BackButton />
      <div className="text-center mt-16">
        <div className="h-1 w-24 mx-auto rounded-full bg-gradient-to-r from-brand-blue to-brand-green mb-8" />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Analise Individual - Historica
        </h1>
        <p className="text-gray-500">Em breve</p>
      </div>
    </main>
  );
}
