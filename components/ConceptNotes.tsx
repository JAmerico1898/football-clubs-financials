import { getMatchingConcepts } from "@/lib/concept-notes";

interface Props {
  /** Metric labels or csvKeys currently visible in the chart */
  metricKeys: string[];
}

export default function ConceptNotes({ metricKeys }: Props) {
  const notes = getMatchingConcepts(metricKeys);
  if (notes.length === 0) return null;

  return (
    <div className="mt-4 space-y-1 text-sm" style={{ color: "var(--text-secondary)" }}>
      {notes.map(([concept, definition]) => (
        <p key={concept}>
          <strong>{concept}:</strong> {definition}
        </p>
      ))}
    </div>
  );
}
