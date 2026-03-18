import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  return (
    <Link
      href="/"
      className="inline-flex items-center gap-1.5 text-sm rounded-lg px-3 py-2
                 transition-colors mb-6
                 text-[var(--text-secondary)] hover:text-[var(--text-primary)]
                 hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      <ArrowLeft size={16} />
      Voltar ao inicio
    </Link>
  );
}
