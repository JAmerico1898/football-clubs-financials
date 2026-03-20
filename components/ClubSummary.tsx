"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface ClubSummaryProps {
  content: string | null;
  loading?: boolean;
  clubSelected?: boolean;
}

export default function ClubSummary({ content, loading, clubSelected }: ClubSummaryProps) {
  if (loading)
    return <p className="text-center py-4" style={{ color: "var(--text-secondary)" }}>Carregando resumo...</p>;
  if (!content && clubSelected) {
    return <p className="text-center py-4" style={{ color: "var(--text-secondary)" }}>Resumo não disponível para este clube.</p>;
  }
  if (!content) return null;

  return (
    <div
      className="w-full mb-6 px-5 py-4 rounded-lg text-sm leading-relaxed
        [&_h4]:font-semibold [&_h4]:text-base [&_h4]:mt-2 [&_h4]:mb-1
        [&_p]:my-1 [&_b]:font-semibold"
      style={{
        backgroundColor: "var(--surface)",
        border: "1px solid var(--border)",
        color: "var(--text-primary)",
      }}
    >
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
    </div>
  );
}
