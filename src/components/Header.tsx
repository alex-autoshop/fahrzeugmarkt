import { Link, NavLink, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";

export function Header() {
  const { pathname } = useLocation();
  const onSell = pathname.startsWith("/inserieren");
  return (
    <header className="glass-nav sticky top-0 z-40 border-b border-black/[0.06]">
      <div className="container-x flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight text-[19px]">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-ink text-white text-sm font-bold">K</span>
          karo
          <span className="ml-1 hidden rounded-full bg-black/[0.05] px-2 py-0.5 text-[11px] font-medium text-sub sm:inline">
            Wuppertal · NRW
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `hidden rounded-full px-4 py-2 text-[14px] font-medium transition-colors sm:block ${
                isActive ? "text-ink" : "text-sub hover:text-ink"
              }`
            }
          >
            Entdecken
          </NavLink>
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
