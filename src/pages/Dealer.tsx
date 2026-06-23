import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles, Upload, Pencil, Trash2, CheckCircle2, RotateCcw, BadgeCheck,
  Car as CarIcon, TrendingUp, Tag,
} from "lucide-react";
import { useCars, carStore, useDealer, dealerStore } from "@/data/store";
import { eur, km } from "@/lib/format";
import { CarImage } from "@/components/CarImage";

type Filter = "alle" | "aktiv" | "verkauft";

export default function Dealer() {
  const cars = useCars();
  const dealer = useDealer();
  const [filter, setFilter] = useState<Filter>("alle");
  const [editOpen, setEditOpen] = useState(false);

  const mine = useMemo(
    () => cars.filter((c) => c.seller.name === dealer.name),
    [cars, dealer.name]
  );

  const aktiv = mine.filter((c) => (c.status ?? "aktiv") === "aktiv");
  const verkauft = mine.filter((c) => c.status === "verkauft");
  const totalValue = aktiv.reduce((s, c) => s + c.price, 0);

  const shown = mine.filter((c) =>
    filter === "alle" ? true : filter === "verkauft" ? c.status === "verkauft" : (c.status ?? "aktiv") === "aktiv"
  );

  return (
    <div className="container-x py-6 sm:py-10">
      {/* Kopf */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="flex items-center gap-1.5 text-[13px] font-medium text-sub">
            <BadgeCheck className="h-4 w-4 text-accent" /> Händler-Dashboard
          </p>
          <h1 className="mt-1 flex items-center gap-2 text-[28px] font-semibold tracking-tight sm:text-[32px]">
            {dealer.name}
            <button onClick={() => setEditOpen((v) => !v)} className="text-sub hover:text-ink" aria-label="Profil bearbeiten">
              <Pencil className="h-4.5 w-4.5" />
            </button>
          </h1>
          <p className="text-[14px] text-sub">{dealer.city} · {dealer.phone}</p>
        </div>
        <div className="flex flex-wrap gap-2.5">
          <Link to="/inserieren" className="btn-accent h-11 px-5 text-[14px]"><Sparkles className="h-4.5 w-4.5" /> Inserat erstellen</Link>
          <Link to="/import" className="btn-dark h-11 px-5 text-[14px]"><Upload className="h-4.5 w-4.5" /> Bestand importieren</Link>
        </div>
      </div>

      {/* Profil bearbeiten */}
      {editOpen && (
        <div className="card mt-4 grid gap-2.5 p-4 sm:grid-cols-3">
          <input className="input" value={dealer.name} onChange={(e) => dealerStore.set({ name: e.target.value })} placeholder="Händlername" />
          <input className="input" value={dealer.city} onChange={(e) => dealerStore.set({ city: e.target.value })} placeholder="Stadt" />
          <input className="input" value={dealer.phone} onChange={(e) => dealerStore.set({ phone: e.target.value })} placeholder="Telefon" />
        </div>
      )}

      {/* Statistik */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { icon: CarIcon, label: "Aktive Inserate", value: String(aktiv.length) },
          { icon: Tag, label: "Verkauft", value: String(verkauft.length) },
          { icon: TrendingUp, label: "Bestandswert", value: eur(totalValue) },
        ].map((s) => (
          <div key={s.label} className="card p-4">
            <s.icon className="h-5 w-5 text-accent" />
            <p className="mt-2 text-[22px] font-semibold tracking-tight sm:text-[26px]">{s.value}</p>
            <p className="text-[12.5px] text-sub">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="mt-6 flex items-center gap-2">
        {(["alle", "aktiv", "verkauft"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-[13px] font-medium capitalize transition-all ${
              filter === f ? "bg-ink text-white" : "bg-black/[0.04] text-sub hover:text-ink"
            }`}
          >
            {f} {f === "aktiv" ? `(${aktiv.length})` : f === "verkauft" ? `(${verkauft.length})` : `(${mine.length})`}
          </button>
        ))}
      </div>

      {/* Liste */}
      {shown.length === 0 ? (
        <div className="card mt-4 grid place-items-center px-6 py-16 text-center">
          <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-black/[0.04]"><CarIcon className="h-7 w-7 text-sub" /></span>
          <p className="text-[16px] font-semibold">Noch keine Fahrzeuge</p>
          <p className="mt-1 max-w-[300px] text-[13px] text-sub">Importiere deinen kompletten Bestand auf einmal oder erstelle ein Inserat per KI.</p>
          <div className="mt-5 flex gap-2.5">
            <Link to="/import" className="btn-dark h-11 px-5 text-[14px]"><Upload className="h-4.5 w-4.5" /> Importieren</Link>
            <Link to="/inserieren" className="btn-ghost h-11 px-5 text-[14px]"><Sparkles className="h-4.5 w-4.5" /> Inserat erstellen</Link>
          </div>
        </div>
      ) : (
        <div className="mt-4 space-y-2.5">
          {shown.map((c) => {
            const sold = c.status === "verkauft";
            return (
              <div key={c.id} className={`card flex items-center gap-3 p-3 ${sold ? "opacity-60" : ""}`}>
                <Link to={`/auto/${c.id}`} className="shrink-0">
                  <CarImage src={c.images[0]} alt="" className="h-16 w-24 rounded-xl" />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Link to={`/auto/${c.id}`} className="truncate text-[15px] font-semibold hover:text-accent">{c.make} {c.model}</Link>
                    {sold && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10.5px] font-bold uppercase text-emerald-600">Verkauft</span>}
                  </div>
                  <p className="truncate text-[12.5px] text-sub">
                    {[c.year || null, c.mileage ? km(c.mileage) : null, c.fuel].filter(Boolean).join(" · ")}
                  </p>
                  <p className="text-[15px] font-semibold">{eur(c.price)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <button
                    onClick={() => carStore.update(c.id, { status: sold ? "aktiv" : "verkauft" })}
                    className="grid h-9 w-9 place-items-center rounded-lg text-sub hover:bg-black/[0.05] hover:text-emerald-600"
                    title={sold ? "Wieder aktiv" : "Als verkauft markieren"}
                  >
                    {sold ? <RotateCcw className="h-4.5 w-4.5" /> : <CheckCircle2 className="h-4.5 w-4.5" />}
                  </button>
                  <button
                    onClick={() => { if (confirm(`„${c.make} ${c.model}“ wirklich löschen?`)) carStore.remove(c.id); }}
                    className="grid h-9 w-9 place-items-center rounded-lg text-sub hover:bg-red-50 hover:text-red-500"
                    title="Löschen"
                  >
                    <Trash2 className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
