import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search as SearchIcon, SlidersHorizontal, X } from "lucide-react";
import { useCars } from "@/data/store";
import { CarCard } from "@/components/CarCard";

const FUELS = ["Alle", "Benzin", "Diesel", "Elektro", "Hybrid"] as const;
const SORTS = ["Neueste", "Preis ↑", "Preis ↓", "km ↑"] as const;

// erkennt "bis 5000" / "5.000 €" im Freitext
function extractMaxPrice(q: string): number | null {
  const m = q.match(/(?:bis\s*)?(\d{1,3}(?:[.\s]\d{3})+|\d{3,6})\s*(?:€|eur|euro)?/i);
  if (m && /bis|€|eur|euro/i.test(q)) return parseInt(m[1].replace(/[.\s]/g, ""), 10);
  return null;
}

export default function Search() {
  const cars = useCars();
  const [params] = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [fuel, setFuel] = useState<(typeof FUELS)[number]>("Alle");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Neueste");
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    const incoming = params.get("q");
    if (incoming) {
      setQ(incoming);
      const mp = extractMaxPrice(incoming);
      if (mp) setMaxPrice(mp);
      const f = FUELS.find((x) => incoming.toLowerCase().includes(x.toLowerCase()) && x !== "Alle");
      if (f) setFuel(f);
    }
  }, [params]);

  const filtered = useMemo(() => {
    const cleanQ = q.replace(/(?:bis\s*)?\d[\d.\s]*\s*(?:€|eur|euro)/gi, "").trim().toLowerCase();
    let list = cars.filter((c) => {
      const hay = `${c.make} ${c.model} ${c.variant ?? ""} ${c.city} ${c.color ?? ""} ${c.fuel}`.toLowerCase();
      if (cleanQ && !cleanQ.split(/\s+/).every((w) => hay.includes(w))) return false;
      if (fuel !== "Alle" && c.fuel !== fuel) return false;
      if (maxPrice !== "" && c.price > maxPrice) return false;
      return true;
    });
    list = [...list].sort((a, b) =>
      sort === "Preis ↑" ? a.price - b.price :
      sort === "Preis ↓" ? b.price - a.price :
      sort === "km ↑" ? a.mileage - b.mileage :
      b.createdAt - a.createdAt
    );
    return list;
  }, [cars, q, fuel, maxPrice, sort]);

  return (
    <div className="animate-fade-up">
      <div className="sticky top-14 z-30 -mx-4 mb-4 bg-bg/90 px-4 pb-3 pt-1 backdrop-blur-xl">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-faint" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Marke, Modell, Ort …"
              className="field pl-11"
            />
            {q && (
              <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-faint">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilter((v) => !v)}
            className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl border ${showFilter ? "border-gold/60 text-gold" : "border-hair text-ink"}`}
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>

        {showFilter && (
          <div className="mt-3 space-y-3 animate-fade-up">
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {FUELS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFuel(f)}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium ${fuel === f ? "bg-gold text-black" : "bg-white/[0.06] text-sub"}`}
                >
                  {f}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="max € Preis"
                className="field h-11 flex-1 text-[14px]"
              />
              <select value={sort} onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])} className="field h-11 w-auto text-[14px]">
                {SORTS.map((s) => <option key={s} className="bg-surface">{s}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      <p className="mb-3 text-[13px] text-sub">{filtered.length} Treffer in NRW</p>

      {filtered.length === 0 ? (
        <div className="surface grid place-items-center py-16 text-center text-[14px] text-sub">
          Keine Treffer — probier weniger Filter.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-3 gap-y-5">
          {filtered.map((car) => <CarCard key={car.id} car={car} />)}
        </div>
      )}
    </div>
  );
}
