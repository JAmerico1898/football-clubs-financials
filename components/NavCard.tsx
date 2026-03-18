import Link from "next/link";
import type { Route } from "@/lib/routes";

export default function NavCard({ route }: { route: Route }) {
  const Icon = route.icon;

  return (
    <Link
      href={route.href}
      className="nav-card group"
      style={{ "--card-accent": route.accent } as React.CSSProperties}
    >
      {!route.available && (
        <span className="absolute top-3 right-3 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-[var(--text-secondary)]">
          Em breve
        </span>
      )}

      <Icon size={24} style={{ color: "var(--brand-blue)" }} className="mb-3" />

      <h2 className="text-lg font-semibold transition-colors group-hover:text-[var(--brand-blue)]" style={{ color: "var(--text-primary)" }}>
        {route.label}
      </h2>

      <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
        {route.description}
      </p>
    </Link>
  );
}
