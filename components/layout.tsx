import Link from "next/link";
import { ReactNode } from "react";
import { Locale, t } from "@/lib/i18n";

export function AppLayout({ children, locale }: { children: ReactNode; locale: Locale }) {
  const nav = [
    [t(locale, "navDashboard"), "/dashboard"],
    [t(locale, "navScreeners"), "/screeners"],
    [t(locale, "navStrategies"), "/strategies"],
    [t(locale, "navBacktests"), "/backtests"],
    [t(locale, "navWatchlist"), "/watchlist"],
    [t(locale, "navSettings"), "/settings"]
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-slate-800 bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-xl font-bold text-accent">{t(locale, "appTitle")}</h1>
          <nav className="flex gap-4 text-sm">
            {nav.map(([label, href]) => (
              <Link key={href} href={href} className="text-slate-300 transition hover:text-accent">
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  );
}
