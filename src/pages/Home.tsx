import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, ChevronRight, Zap, ShieldCheck, MapPin } from "lucide-react";
import { useCars } from "@/data/store";
import { CarCard } from "@/components/CarCard";

const QUICK = ["VW Golf", "BMW", "Cabrio", "Elektro", "bis 5.000 €", "Automatik"];

export default function Home() {
  const cars = useCars();
  const nav = useNavigate();
  const [q, setQ] = useState("");

  const go = (term: string) => nav(`/suche?q=${encodeURIComponent(term)}`);

  return (
    <div className="animate-fade-up">
      {/* KI-Suche */}
      <form
        onSubmit={(e) => { e.preventDefault(); go(q); }}
        className="surface mb-4 flex items-center gap-3 p-3.5"
      >
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-soft text-gold">
          <Sparkles className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Suche per KI …"
            className="w-full bg-transparent text-[15px] font-semibold text-ink outline-none placeholder:text-ink"
          />
          <p className="truncate text-[12px] text-faint">Fahrzeug · Baujahr · Kilometer · Preis</p>
        </div>
        <ChevronRight className="h-5 w-5 text-faint" />
      </form>

      {/* Quick-Chips */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {QUICK.map((c) => (
          <button key={c} onClick={() => go(c)} className="chip shrink-0 px-3 py-1.5 text-[13px]">{c}</button>
        ))}
      </div>

      {/* Verkaufen-Banner */}
      <Link to="/verkaufen" className="mb-6 block overflow-hidden rounded-2xl bg-gradient-to-r from-gold to-gold-deep p-4 text-black">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 shrink-0" />
          <div className="flex-1">
            <p className="text-[15px] font-extrabold leading-tight">Auto inserieren in 60 Sekunden</p>
            <p className="text-[12.5px] font-medium opacity-80">Einfach beschreiben — die KI macht den Rest.</p>
          </div>
          <ChevronRight className="h-5 w-5" />
        </div>
      </Link>

      <div className="mb-3 flex items-center gap-3 text-[11.5px] text-sub">
        <span className="inline-flex items-center gap-1"><Zap className="h-3.5 w-3.5 text-gold" /> 60 Sek.</span>
        <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-gold" /> Verifiziert</span>
        <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-gold" /> Wuppertal & NRW</span>
      </div>

      {/* Empfehlungen */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[20px] font-bold">Empfehlungen</h2>
        <Link to="/suche" className="text-[13px] font-semibold text-gold">Alle ansehen</Link>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-5">
        {cars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </div>
  );
}
