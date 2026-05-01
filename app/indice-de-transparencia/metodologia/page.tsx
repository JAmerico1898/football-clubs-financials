import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import ModuleNavbar from "@/components/ModuleNavbar";

type Metric = { n: number; question: string; scoring: string };

const NIVEL1: Metric[] = [
  { n: 1, question: "Publicou relatório de auditoria independente?", scoring: "Sim = 1 / Não = 0" },
  { n: 2, question: "Nota explicativa com contingências de perda “possível”?", scoring: "Sim = 1 / Não = 0" },
  { n: 3, question: "Receitas detalhadas em ≥ 4 linhas (transmissão, patrocínio, bilheteria, transferências)?", scoring: "Sim = 1 / Não = 0" },
  { n: 4, question: "Despesas detalhadas em ≥ 3 linhas (folha, direitos de imagem, administrativas)?", scoring: "Sim = 1 / Não = 0" },
  { n: 5, question: "Resultado financeiro detalhado em juros e variação cambial?", scoring: "Sim = 1 / Não = 0" },
  { n: 6, question: "Intangível com aquisição, formação e atletas formados discriminados?", scoring: "Sim = 1 / Não = 0" },
  { n: 7, question: "Publicou todas as DFs obrigatórias (BP, DRE, DRA, DMPL, DFC + NE) até 30 de abril?", scoring: "Todas no prazo = 1 / Qualquer descumprimento = 0" },
];

const NIVEL2: Metric[] = [
  { n: 8, question: "Individualizou receitas/despesas entre futebol e clube social (ou é SAF)?", scoring: "Sim ou SAF = 1 / Não = 0" },
  { n: 9, question: "Detalhamento de dívidas com instituições financeiras (taxas, prazos, garantias)?", scoring: "Sim ou sem dívidas = 1 / Não = 0" },
  { n: 10, question: "Contas a receber/pagar com intermediários detalhadas (valores e prazos)?", scoring: "Sim ou não há = 1 / Não = 0" },
  { n: 11, question: "Contas a receber/pagar por transferências de atletas detalhadas (valores e prazos)?", scoring: "Sim ou não há = 1 / Não = 0" },
  { n: 12, question: "Publicou DFs trimestrais no exercício anterior?", scoring: "Sim = 1 / Não = 0" },
  { n: 13, question: "Publicou orçamento para o exercício seguinte?", scoring: "Sim = 1 / Não = 0" },
  { n: 14, question: "Receitas de transmissão detalhadas por competição?", scoring: "Sim = 1 / Não = 0" },
  { n: 15, question: "Individualizou receita de premiação na DRE e detalhou por competição?", scoring: "Ambas = 1 / Apenas uma = 0,5 / Nenhuma = 0" },
];

const NIVEL3: Metric[] = [
  { n: 16, question: "Auditoria fez ressalvas ou absteve-se de opinar?", scoring: "Ressalvou = −2 / Absteve-se = −1 / Parecer positivo = 1" },
  { n: 17, question: "Reapresentou demonstrações alterando resultado líquido do ano anterior?", scoring: "Sim = −1 / Não = 1" },
  { n: 18, question: "Incluiu relatório narrativo para facilitar entendimento do leigo?", scoring: "Sim = 1 / Não = 0" },
  { n: 19, question: "Divulgou KPIs?", scoring: "≥ 2 KPIs = 1 / 1 KPI = 0,5 / 0 KPIs = 0" },
];

function MetricsTable({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "2px solid var(--text-secondary)" }}>
            <th className="text-left py-2 pr-3 font-semibold w-10" style={{ color: "var(--text-primary)" }}>#</th>
            <th className="text-left py-2 pr-3 font-semibold" style={{ color: "var(--text-primary)" }}>Pergunta-chave</th>
            <th className="text-left py-2 pl-3 font-semibold whitespace-nowrap" style={{ color: "var(--text-primary)" }}>Pontuação</th>
          </tr>
        </thead>
        <tbody>
          {metrics.map((m) => (
            <tr key={m.n} style={{ borderBottom: "1px solid rgba(100,116,139,0.2)" }}>
              <td className="py-2 pr-3 font-semibold" style={{ color: "var(--text-secondary)" }}>{m.n}</td>
              <td className="py-2 pr-3" style={{ color: "var(--text-primary)" }}>{m.question}</td>
              <td className="py-2 pl-3 text-xs" style={{ color: "var(--text-secondary)" }}>{m.scoring}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function MetodologiaTransparencia() {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img src="/grass-bg.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 light-page-bg-overlay" />
      </div>

      <main className="relative z-10 max-w-[960px] mx-auto px-4 py-8">
        <ModuleNavbar />

        <h1
          className="text-3xl font-bold tracking-tight text-center mb-2"
          style={{ color: "var(--text-primary)" }}
        >
          Metodologia
        </h1>
        <p className="text-center mb-2" style={{ color: "var(--text-secondary)" }}>
          Como funciona o Índice de Transparência das Demonstrações Financeiras
        </p>
        <p
          className="text-center text-xs italic mb-8 max-w-[640px] mx-auto"
          style={{ color: "var(--text-secondary)" }}
        >
          Inspirado nos trabalhos de Capelo, Grafietti, Kessel e Salomão (2021), Horvath e Vaško
          (2012) e Antunes, De Moraes e Grapiúna (2023).
        </p>

        <div className="space-y-8">
          {/* Camada 1 — O que o Índice mede */}
          <section className="card-surface">
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--brand-blue)" }}>
              O que o Índice mede
            </h2>
            <p style={{ color: "var(--text-primary)", lineHeight: 1.7 }}>
              O <strong>Índice de Transparência</strong> avalia, em uma escala de até 19 pontos, a
              qualidade das Demonstrações Financeiras publicadas por cada clube. Não mede saúde
              financeira — mede o quanto o clube <strong>revela</strong> sobre suas finanças.
              Quanto maior a nota, mais informação útil o clube disponibiliza ao torcedor, ao
              investidor e à imprensa.
            </p>
          </section>

          {/* Camada 2 — Os três níveis */}
          <section>
            <h2 className="text-xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
              Os três níveis
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="card-surface" style={{ borderTop: "4px solid var(--brand-green)" }}>
                <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--brand-green)" }}>
                  Nível 1 · 7 critérios
                </div>
                <h3 className="font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                  Reportes Obrigatórios
                </h3>
                <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
                  Itens que a legislação ou as boas práticas contábeis já exigem: auditoria, prazo,
                  abertura de receitas/despesas, intangível.
                </p>
                <p className="text-xs italic" style={{ color: "var(--text-secondary)" }}>
                  &ldquo;O clube faz o básico?&rdquo;
                </p>
              </div>

              <div className="card-surface" style={{ borderTop: "4px solid var(--brand-blue)" }}>
                <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--brand-blue)" }}>
                  Nível 2 · 8 critérios
                </div>
                <h3 className="font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                  Reportes Discricionários
                </h3>
                <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
                  Itens que o clube <em>escolhe</em> divulgar e que aprofundam a leitura: dívidas com
                  taxas e prazos, intermediários, orçamento, DFs trimestrais, premiação por
                  competição.
                </p>
                <p className="text-xs italic" style={{ color: "var(--text-secondary)" }}>
                  &ldquo;Vai além do básico?&rdquo;
                </p>
              </div>

              <div className="card-surface" style={{ borderTop: "4px solid var(--brand-gold)" }}>
                <div className="text-xs font-semibold uppercase tracking-wide mb-1" style={{ color: "var(--brand-gold)" }}>
                  Nível 3 · 4 critérios
                </div>
                <h3 className="font-bold mb-2" style={{ color: "var(--text-primary)" }}>
                  Indicadores de Qualidade
                </h3>
                <p className="text-sm mb-3" style={{ color: "var(--text-secondary)" }}>
                  Sinais sobre a confiabilidade do que foi reportado: ressalvas de auditoria,
                  reapresentação de resultados, narrativa explicativa e KPIs.
                </p>
                <p className="text-xs italic" style={{ color: "var(--text-secondary)" }}>
                  &ldquo;O que está reportado é confiável e legível?&rdquo;
                </p>
              </div>
            </div>
          </section>

          {/* Camada 3 — A régua de pontuação */}
          <section className="card-surface">
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
              A régua de pontuação
            </h2>
            <p className="text-sm mb-4" style={{ color: "var(--text-secondary)" }}>
              Cada critério é avaliado individualmente e recebe um valor numérico segundo a régua
              abaixo. O total do clube é a soma dos 19 valores.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "2px solid var(--text-secondary)" }}>
                    <th className="text-left py-2 pr-3 font-semibold w-20" style={{ color: "var(--text-primary)" }}>Valor</th>
                    <th className="text-left py-2 pl-3 font-semibold" style={{ color: "var(--text-primary)" }}>Significado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: "1px solid rgba(100,116,139,0.2)" }}>
                    <td className="py-2 pr-3 font-bold" style={{ color: "var(--brand-green)" }}>1</td>
                    <td className="py-2 pl-3" style={{ color: "var(--text-primary)" }}>Critério plenamente atendido</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid rgba(100,116,139,0.2)" }}>
                    <td className="py-2 pr-3 font-bold" style={{ color: "var(--brand-blue)" }}>0,5</td>
                    <td className="py-2 pl-3" style={{ color: "var(--text-primary)" }}>Critério parcialmente atendido (apenas em métricas que admitem)</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid rgba(100,116,139,0.2)" }}>
                    <td className="py-2 pr-3 font-bold" style={{ color: "var(--text-secondary)" }}>0</td>
                    <td className="py-2 pl-3" style={{ color: "var(--text-primary)" }}>Não atendido <strong>ou</strong> informação ausente nas DFs</td>
                  </tr>
                  <tr style={{ borderBottom: "1px solid rgba(100,116,139,0.2)" }}>
                    <td className="py-2 pr-3 font-bold" style={{ color: "var(--brand-red)" }}>−1</td>
                    <td className="py-2 pl-3" style={{ color: "var(--text-primary)" }}>Reapresentação que alterou resultado anterior, ou abstenção do auditor</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-3 font-bold" style={{ color: "var(--brand-red)" }}>−2</td>
                    <td className="py-2 pl-3" style={{ color: "var(--text-primary)" }}>Auditoria emitiu parecer com ressalvas</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p
              className="text-sm mt-4 pt-4"
              style={{
                color: "var(--text-secondary)",
                borderTop: "1px solid rgba(100,116,139,0.2)",
              }}
            >
              <strong style={{ color: "var(--text-primary)" }}>Regra de ouro:</strong> o silêncio
              das DFs <em>não</em> conta a favor do clube. Ausência de informação vale 0.
            </p>
          </section>

          {/* Camada 4 — As 19 métricas */}
          <section>
            <h2 className="text-xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
              As 19 métricas
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              Lista completa dos critérios avaliados, agrupados por nível.
            </p>

            <div className="card-surface mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block w-2 h-6 rounded" style={{ backgroundColor: "var(--brand-green)" }} />
                <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>
                  Nível 1 — Reportes Obrigatórios
                </h3>
              </div>
              <MetricsTable metrics={NIVEL1} />
            </div>

            <div className="card-surface mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block w-2 h-6 rounded" style={{ backgroundColor: "var(--brand-blue)" }} />
                <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>
                  Nível 2 — Reportes Discricionários
                </h3>
              </div>
              <MetricsTable metrics={NIVEL2} />
            </div>

            <div className="card-surface">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block w-2 h-6 rounded" style={{ backgroundColor: "var(--brand-gold)" }} />
                <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>
                  Nível 3 — Indicadores de Qualidade
                </h3>
              </div>
              <MetricsTable metrics={NIVEL3} />
            </div>
          </section>

          {/* Atenções específicas */}
          <section className="card-surface">
            <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
              Pontos de atenção na leitura
            </h2>
            <ul className="space-y-2 text-sm" style={{ color: "var(--text-primary)" }}>
              <li>
                <strong>Métrica 7 (prazo):</strong> exige verificação da data de publicação. Se a
                data não puder ser confirmada, o critério é registrado como 0.
              </li>
              <li>
                <strong>Métricas 9, 10 e 11:</strong> &ldquo;não há&rdquo; (por exemplo, clube sem
                dívidas com bancos) equivale a <strong>1 ponto</strong> — a ausência da rubrica não
                penaliza quando o item simplesmente não se aplica ao clube.
              </li>
              <li>
                <strong>Métrica 16:</strong> é a única que pode descontar até 2 pontos, refletindo a
                gravidade de uma ressalva formal por parte da auditoria independente.
              </li>
            </ul>
          </section>

          {/* Voltar ao módulo */}
          <div className="text-center pt-4">
            <Link
              href="/indice-de-transparencia"
              className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-all active:shadow-none active:scale-[0.98]"
              style={{ backgroundColor: "var(--brand-blue)" }}
            >
              <ArrowLeft size={16} />
              Voltar ao Índice de Transparência
            </Link>
          </div>
        </div>

        <ModuleNavbar />
      </main>
    </>
  );
}
