import { NavLink } from "react-router-dom";
import { Home, Search, Star, Heart, Tag } from "lucide-react";
import { useFavorites } from "@/data/favorites";

const TABS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/suche", label: "Suche", icon: Search },
  { to: "/meine-suchen", label: "Meine Suchen", icon: Star },
  { to: "/merkliste", label: "Merkliste", icon: Heart, badge: true },
  { to: "/verkaufen", label: "Verkaufen", icon: Tag },
];

export function BottomNav() {
  const favs = useFavorites();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-hair bg-bg/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <div className="app-x flex items-stretch justify-between">
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[10.5px] font-medium transition-colors ${
                isActive ? "text-gold" : "text-sub hover:text-ink"
              }`
            }
          >
            <span className="relative">
              <t.icon className="h-[22px] w-[22px]" />
              {t.badge && favs.length > 0 && (
                <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[9px] font-bold text-black">
                  {favs.length}
                </span>
              )}
            </span>
            {t.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
