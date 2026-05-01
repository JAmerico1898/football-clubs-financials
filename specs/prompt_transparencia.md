# Prompt — Preenchimento do Índice de Transparência das Demonstrações Financeiras

## Contexto

Você receberá dois arquivos:

1. **`Balanços - clubes-2026.xlsx`** — planilha com a aba **`transparencia`**, estruturada da seguinte forma:
   - **Coluna A:** Ano de referência
   - **Coluna B:** Nível de transparência (Nível 1, 2 ou 3)
   - **Coluna C:** Rubrica — contém a pergunta avaliativa **e** a régua de pontuação no mesmo campo de texto
   - **Colunas D em diante:** Uma coluna por clube (ex.: Atlético GO, Atlético, Athletico, Bahia…)
   - **Última coluna:** `Média da Liga` — não preencher; é calculada por fórmula

2. **Demonstrações Financeiras do clube** — arquivo PDF ou Excel contendo BP, DRE, DRA, DMPL, DFC e Notas Explicativas referentes ao exercício social indicado na coluna A da planilha.

---

## Sua Tarefa

Para **um clube por vez** (conforme o arquivo de DF enviado), preencha todas as **19 métricas** da coluna correspondente ao clube na aba `Transparência`.

---

## Instruções de Preenchimento

### 1. Leitura da Régua

Cada célula da coluna C contém a pergunta e os critérios de pontuação. Leia o texto completo da célula e aplique **exatamente** a régua ali descrita. Exemplos dos valores possíveis:

| Situação | Valor |
|---|---|
| Critério plenamente atendido | `1` |
| Critério parcialmente atendido (quando previsto) | `0,5` |
| Critério não atendido / informação ausente | `0` |
| Reapresentação alterou resultado anterior | `-1` |
| Auditoria fez ressalvas | `-2` |

> **Regra geral:** ausência de informação nas DFs equivale a **0** — nunca deixe a célula em branco.

### 2. Valor na Célula

- Insira apenas o **valor numérico** (ex.: `1`, `0`, `0,5`, `-1`, `-2`) na célula do clube.
- Use vírgula como separador decimal, conforme padrão brasileiro.

### 3. Comentário Excel Obrigatório

Para **cada célula preenchida**, insira um comentário Excel contendo:

```
[Rubrica resumida]
Evidência: [trecho ou referência exata nas DFs — página, nota ou linha da demonstração]
Pontuação aplicada: [valor] — [justificativa em 1 linha]
```

**Exemplo:**
```
Relatório de auditoria independente
Evidência: Parecer dos Auditores Independentes, p. 3 — opinião sem ressalvas
Pontuação aplicada: 1 — parecer limpo publicado dentro do prazo
```

Se a informação não for encontrada nas DFs, registre:
```
[Rubrica resumida]
Evidência: Não localizada nas DFs analisadas
Pontuação aplicada: 0 — ausência tratada como não cumprimento
```

### 4. Coluna `Média da Liga`

**Não preencha esta coluna.** Ela é calculada automaticamente por fórmula.

---

## As 19 Métricas — Referência Rápida

### Nível 1 — Reportes Obrigatórios (linhas 2 a 8)

| # | Pergunta-chave | Pontuação |
|---|---|---|
| 1 | Publicou relatório de auditoria independente? | Sim = 1 / Não = 0 |
| 2 | Nota explicativa com contingências de perda "possível"? | Sim = 1 / Não = 0 |
| 3 | Receitas detalhadas em ≥ 4 linhas (transmissão, patrocínio, bilheteria, transferências)? | Sim = 1 / Não = 0 |
| 4 | Despesas detalhadas em ≥ 3 linhas (folha, direitos de imagem, administrativas)? | Sim = 1 / Não = 0 |
| 5 | Resultado financeiro detalhado em juros e variação cambial? | Sim = 1 / Não = 0 |
| 6 | Intangível com aquisição, formação e atletas formados discriminados? | Sim = 1 / Não = 0 |
| 7 | Publicou todas as DFs obrigatórias (BP, DRE, DRA, DMPL, DFC + NE) até 30 de abril? | Todas no prazo = 1 / Qualquer descumprimento = 0 |

### Nível 2 — Reportes Discricionários (linhas 9 a 15)

| # | Pergunta-chave | Pontuação |
|---|---|---|
| 8 | Individualizou receitas/despesas entre futebol e clube social (ou é SAF)? | Sim ou SAF = 1 / Não = 0 |
| 9 | Detalhamento de dívidas com inst. financeiras (taxas, prazos, garantias)? | Sim ou sem dívidas = 1 / Não = 0 |
| 10 | Contas a receber/pagar com intermediários detalhadas (valores e prazos)? | Sim ou não há = 1 / Não = 0 |
| 11 | Contas a receber/pagar por transferências de atletas detalhadas (valores e prazos)? | Sim ou não há = 1 / Não = 0 |
| 12 | Publicou DFs trimestrais no exercício anterior? | Sim = 1 / Não = 0 |
| 13 | Publicou orçamento para o exercício seguinte? | Sim = 1 / Não = 0 |
| 14 | Receitas de transmissão detalhadas por competição? | Sim = 1 / Não = 0 |
| 15 | Individualizou receita de premiação na DRE **e** detalhou por competição? | Ambas = 1 / Apenas uma = 0,5 / Nenhuma = 0 |

### Nível 3 — Indicadores de Qualidade (linhas 16 a 19)

| # | Pergunta-chave | Pontuação |
|---|---|---|
| 16 | Auditoria fez ressalvas ou absteve-se de opinar? | Ressalvou = -2 / Absteve-se = -1 / Parecer positivo = 1 |
| 17 | Reapresentou demonstrações alterando resultado líquido do ano anterior? | Sim = -1 / Não = 1 |
| 18 | Incluiu relatório narrativo para facilitar entendimento do leigo? | Sim = 1 / Não = 0 |
| 19 | Divulgou KPIs? | ≥ 2 KPIs = 1 / 1 KPI = 0,5 / 0 KPIs = 0 |

---

## Fluxo de Trabalho Recomendado

```
Para cada métrica (linhas 2 a 19):
  1. Leia o texto completo da coluna C (pergunta + régua)
  2. Localize a evidência nas DFs do clube
  3. Aplique a régua e determine o valor
  4. Insira o valor numérico na célula [clube × métrica]
  5. Adicione o comentário Excel com evidência e justificativa
```

---

## Restrições e Alertas

- **Não altere** colunas A, B e C — são estrutura fixa da planilha.
- **Não preencha** a coluna `Média da Liga`.
- **Não interprete** o silêncio das DFs como positivo: ausência = 0.
- **Métrica 7 (prazo):** verifique a data de publicação das DFs; se não for possível confirmar a data, registre 0 com comentário explicativo.
- **Métricas 9, 10 e 11:** "não há" (ex.: clube sem dívidas com bancos) equivale a **1 ponto** — leia a régua com atenção.
- **Métrica 16:** é a única com pontuação negativa de dois dígitos (-2); confira o parecer do auditor antes de atribuir.
