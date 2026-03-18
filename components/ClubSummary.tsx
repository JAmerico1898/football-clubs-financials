"use client";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface ClubSummaryProps {
  content: string | null;
  loading?: boolean;
  clubSelected?: boolean;
}

export default function ClubSummary({ content, loading, clubSelected }: ClubSummaryProps) {
  if (loading) return <p className="text-center text-gray-500 py-4">Carregando resumo...</p>;
  if (!content && clubSelected) {
    return <p className="text-center text-gray-500 italic py-4">Resumo não disponível para este clube.</p>;
  }
  if (!content) return null;

  return (
    <div
      className="max-w-2xl mx-auto mb-6 px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg text-sm leading-relaxed
        [&_h4]:font-semibold [&_h4]:text-base [&_h4]:mt-2 [&_h4]:mb-1
        [&_p]:my-1 [&_p]:text-gray-700
        [&_b]:font-semibold"
    >
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
    </div>
  );
}
