import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Sparkles, Zap, ShieldCheck, MapPin, ArrowRight, X } from "lucide-react";
import { useCars } from "@/data/store";
import { CarCard } from "@/components/CarCard";

const FUELS = ["Alle", "Benzin", "Diesel", "Elektro", "Hybrid"] as const;
const SORTS = ["Neueste", "Preis ↑", "Preis ↓", "km ↑"] as const;

export default function Home() {
  const cars = useCars();
  const [q, setQ] = useState("");
  const [fuel, setFuel] = useState<(typeof FUELS)[number]>("Alle");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [sort, setSort] = useState<(typeof SORTS)[number]>("Neueste");

  const filtered = useMemo(() => {
    let list = cars.filter((c) => {
      const hay = `${c.make} ${c.model} ${c.variant ?? ""} ${c.city} ${c.color ?? ""}`.toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      if (fuel !== "Alle" && c.fuel !== fuel) return false;
      if (maxPrice !== "" && c.price > maxPrice) return false;
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === "Preis ↑") return a.price - b.price;
      if (sort === "Preis ↓") return b.price - a.price;
      if (sort === "km ↑") return a.mileage - b.mileage;
      return b.createdAt - a.createdAt;
    });
    return list;
  }, [cars, q, fuel, maxPrice, sort]);

  const hasFilter = q || fuel !== "Alle" || maxPrice !== "";

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{ background: "radial-gradient(900px 380px at 50% -8%, rgba(0,113,227,0.10), transparent 70%)" }}
        />
        <div className="container-x relative pt-16 pb-10 text-center sm:pt-24 sm:pb-14">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="chip mx-auto mb-6 bg-accent-soft text-accent"
          >
            <Sparkles className="h-3.5 w-3.5" /> Inserieren per KI · in 60 Sekunden
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="display text-[40px] leading-[1.04] sm:text-[68px]"
          >
            Dein nächstes Auto.
            <br />
            <span className="text-sub">Direkt aus der Region.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-sub"
          >
            Der Fahrzeugmarkt für Wuppertal & NRW. Kaufen ohne Plattform-Gebühren — und
            verkaufen so einfach wie eine WhatsApp.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link to="/inserieren" className="btn-accent w-full sm:w-auto">
              <Sparkles className="h-4.5 w-4.5" /> Auto inserieren
            </Link>
            <a href="#markt" className="btn-ghost w-full sm:w-auto">
              Fahrzeuge ansehen <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>

          <div className="mx-auto mt-10 flex max-w-2xl flex-wrap items-center justify-center gap-x-7 gap-y-3 text-[13px] text-sub">
            <span className="inline-flex items-center gap-1.5"><Zap className="h-4 w-4 text-accent" /> Inserat in 60 Sek.</span>
            <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-accent" /> Verifizierte Anbieter</span>
            <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-accent" /> Lokal & ohne Provision</span>
          </div>
        </div>
      </section>

      {/* Markt */}
      <section id="markt" className="container-x pb-20">
        {/* Filterleiste */}
        <div className="sticky top-14 z-30 -mx-5 mb-6 border-y border-black/[0.06] bg-canvas/85 px-5 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-sub" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Marke, Modell oder Ort … (z. B. „Golf Wuppertal“)"
                className="input pl-11"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex rounded-full bg-black/[0.04] p-1">
                {FUELS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFuel(f)}
                    className={`rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-all ${
                      fuel === f ? "bg-white text-ink shadow-soft" : "text-sub hover:text-ink"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="max €"
                className="input h-10 w-24 px-3 text-[14px]"
              />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as (typeof SORTS)[number])}
                className="input h-10 w-auto px-3 text-[14px]"
              >
                {SORTS.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-[22px] font-semibold tracking-tight">
            {filtered.length} {filtered.length === 1 ? "Fahrzeug" : "Fahrzeuge"} in NRW
          </h2>
          {hasFilter && (
            <button
              onClick={() => { setQ(""); setFuel("Alle"); setMaxPrice(""); }}
              className="inline-flex items-center gap-1 text-[13px] font-medium text-accent hover:underline"
            >
              <X className="h-3.5 w-3.5" /> Filter zurücksetzen
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="card grid place-items-center py-20 text-center">
            <p className="text-[15px] text-sub">Keine Treffer. Probier weniger Filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((car, i) => (
              <CarCard key={car.id} car={car} index={i} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
