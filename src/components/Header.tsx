import { Link, NavLink, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function Header() {
  const { pathname } = useLocation();
  const onSell = pathname.startsWith("/inserieren");
  return (
    <header className="glass-nav sticky top-0 z-40 border-b border-black/[0.06]">
      <div className="container-x flex h-14 items-center justify-between">
        <Link to="/" className="flex min-w-0 items-center gap-2 sm:gap-2.5">
          {/* Alex-Autoshop-Logo (weiß) auf dunklem Chip — sichtbar auf hellem Header */}
          <span className="flex shrink-0 items-center rounded-xl bg-ink px-2 py-1.5">
            <img
              src={`${import.meta.env.BASE_URL}images/logo-cropped.png`}
              alt="Alex Autoshop"
              className="h-[18px] w-auto sm:h-5"
            />
          </span>
          <span className="truncate text-[15px] font-semibold tracking-tight sm:text-[16px]">
            Fahrzeug<span className="text-sub">markt</span>
          </span>
          <span className="ml-1 hidden rounded-full bg-black/[0.05] px-2 py-0.5 text-[11px] font-medium text-sub md:inline">
            Wuppertal · NRW
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {[
            { to: "/", label: "Entdecken", end: true },
            { to: "/haendler", label: "Für Händler", end: false },
          ].map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `hidden rounded-full px-3.5 py-2 text-[14px] font-medium transition-colors sm:block ${
                  isActive ? "text-ink" : "text-sub hover:text-ink"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <LanguageSwitcher />
          {!onSell && (
            <Link to="/inserieren" className="btn-dark h-10 px-4 text-[14px]">
              <Sparkles className="h-4 w-4" />
              Inserieren
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
