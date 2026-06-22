import { Link } from "react-router-dom";
import { Star, Bell, ChevronRight, Plus } from "lucide-react";

// Beispiel-Suchaufträge (würden später pro Nutzer gespeichert)
const SAVED = [
  { id: 1, title: "VW Golf bis 13.000 €", sub: "Benzin · Wuppertal +30 km", neu: 2 },
  { id: 2, title: "Cabrio / Coupé", sub: "Alle Marken · NRW", neu: 0 },
  { id: 3, title: "Elektro bis 35.000 €", sub: "ab 2020 · Automatik", neu: 5 },
];

export default function MySearches() {
  return (
    <div className="animate-fade-up">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-[22px] font-bold">Meine Suchen</h1>
        <Link to="/suche" className="btn-soft h-9 px-3 text-[13px]"><Plus className="h-4 w-4" /> Neu</Link>
      </div>

      <div className="space-y-2.5">
        {SAVED.map((s) => (
          <Link key={s.id} to={`/suche?q=${encodeURIComponent(s.title)}`} className="surface flex items-center gap-3 p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-soft text-gold">
              <Star className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[15px] font-semibold">{s.title}</p>
              <p className="truncate text-[12.5px] text-sub">{s.sub}</p>
            </div>
            {s.neu > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-black">
                <Bell className="h-3 w-3" /> {s.neu} neu
              </span>
            )}
            <ChevronRight className="h-5 w-5 text-faint" />
          </Link>
        ))}
      </div>

      <div className="surface mt-4 p-4 text-center">
        <p className="text-[13px] text-sub">
          Speichere eine Suche und wir <span className="text-gold">benachrichtigen dich</span>, sobald ein passendes Auto reinkommt.
        </p>
      </div>
    </div>
  );
}
