"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface ClubSummaryProps {
  content: string | null;
  loading?: boolean;
  clubSelected?: boolean;
}

function preprocess(raw: string): string {
  let text = raw
    .split("\n")
    .filter((line) => !/^```/.test(line.trim()))
    .join("\n");

  const lines = text.split("\n");
  const firstH1Idx = lines.findIndex((l) => /^#\s+/.test(l));
  if (firstH1Idx !== -1) {
    for (let i = firstH1Idx + 1; i < lines.length; i++) {
      if (/^RESUMO DAS DEMONSTRAÇÕES FINANCEIRAS/i.test(lines[i].trim())) {
        lines.splice(i, 1);
        if (i < lines.length && lines[i].trim() === "") lines.splice(i, 1);
        break;
      }
    }
    text = lines.join("\n");
  }
  return text;
}

export default function ClubSummary({ content, loading, clubSelected }: ClubSummaryProps) {
  if (loading)
    return <p className="text-center py-4" style={{ color: "var(--text-secondary)" }}>Carregando resumo...</p>;
  if (!content && clubSelected) {
    return <p className="text-center py-4" style={{ color: "var(--text-secondary)" }}>Resumo não disponível para este clube.</p>;
  }
  if (!content) return null;

  const processed = preprocess(content);

  return (
    <div
      className="w-full mb-6 px-5 py-4 rounded-lg text-sm leading-relaxed
        [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mt-0 [&_h1]:mb-3
        [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-2
        [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-3 [&_h3]:mb-1
        [&_h4]:font-semibold [&_h4]:text-base [&_h4]:mt-2 [&_h4]:mb-1
        [&_p]:my-2 [&_b]:font-semibold [&_strong]:font-semibold
        [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-2
        [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-2
        [&_li]:my-1"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        color: "var(--text-primary)",
      }}
    >
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{processed}</ReactMarkdown>
    </div>
  );
}
