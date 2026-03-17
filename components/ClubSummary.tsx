"use client";

import { useEffect, useState } from "react";
import { Club, getSummaryUrl } from "@/lib/clubs";

interface ClubSummaryProps {
  club: Club;
}

export default function ClubSummary({ club }: ClubSummaryProps) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    setHtml(null);
    fetch(getSummaryUrl(club))
      .then((res) => {
        if (!res.ok) return null;
        return res.text();
      })
      .then((text) => setHtml(text))
      .catch(() => setHtml(null));
  }, [club]);

  if (!html) return null;

  return (
    <div
      className="max-w-2xl mx-auto mb-6 px-5 py-4 bg-gray-50 border border-gray-200 rounded-lg text-sm leading-relaxed
        [&_h4]:font-semibold [&_h4]:text-base [&_h4]:mt-2 [&_h4]:mb-1
        [&_p]:my-1 [&_p]:text-gray-700
        [&_b]:font-semibold"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
