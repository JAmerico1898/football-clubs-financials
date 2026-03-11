import Link from "next/link";
import type { Route } from "@/lib/routes";

export default function NavCard({ route }: { route: Route }) {
  return (
    <Link href={route.href} className="nav-card group">
      {!route.available && (
        <span className="absolute top-3 right-3 text-xs font-medium bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
          Em breve
        </span>
      )}
      <h2 className="text-lg font-semibold text-gray-800 group-hover:text-brand-blue transition-colors">
        {route.label}
      </h2>
      <p className="mt-2 text-sm text-gray-500 leading-relaxed">
        {route.description}
      </p>
    </Link>
  );
}
