import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ChevronLeft, Heart, Share2, BadgeCheck, Gauge, Calendar, Fuel, Cog, Zap,
  ShieldCheck, MapPin, Phone, MessageSquareText, Check, AlertTriangle,
} from "lucide-react";
import { carStore } from "@/data/store";
import { favStore, useFavorites } from "@/data/favorites";
import { eur, km } from "@/lib/format";
import { CarImage } from "@/components/CarImage";

export default function CarDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const car = id ? carStore.byId(id) : undefined;
  const [active, setActive] = useState(0);
  const favs = useFavorites();

  if (!car) {
    return (
      <div className="py-24 text-center">
        <p className="text-sub">Dieses Inserat gibt es nicht (mehr).</p>
        <Link to="/" className="btn-soft mt-4">Zur Startseite</Link>
      </div>
    );
  }
  const liked = favs.includes(car.id);

  const specs = [
    { icon: Calendar, label: "Baujahr", value: String(car.year) },
    { icon: Gauge, label: "Kilometer", value: km(car.mileage) },
    { icon: Fuel, label: "Kraftstoff", value: car.fuel },
    { icon: Cog, label: "Getriebe", value: car.gearbox },
    ...(car.power ? [{ icon: Zap, label: "Leistung", value: `${car.power} PS` }] : []),
    { icon: ShieldCheck, label: "TÜV", value: car.tuevUntil ?? "—" },
  ];

  return (
    <div className="animate-fade-up -mt-3">
      {/* Top actions */}
      <div className="flex items-center justify-between py-2">
        <button onClick={() => nav(-1)} className="icon-btn -ml-2"><ChevronLeft className="h-6 w-6" /></button>
        <div className="flex">
          <button onClick={() => favStore.toggle(car.id)} className="icon-btn">
            <Heart className={`h-[22px] w-[22px] ${liked ? "fill-gold text-gold" : ""}`} />
          </button>
          <button className="icon-btn"><Share2 className="h-[20px] w-[20px]" /></button>
        </div>
      </div>

      {/* Galerie */}
      <CarImage src={car.images[active]} alt={`${car.make} ${car.model}`} className="aspect-[4/3] w-full rounded-2xl" />
      {car.images.length > 1 && (
        <div className="mt-2.5 flex gap-2 overflow-x-auto pb-1">
          {car.images.map((img, i) => (
            <button key={i} onClick={() => setActive(i)} className={`shrink-0 overflow-hidden rounded-lg ring-2 ${active === i ? "ring-gold" : "ring-transparent opacity-60"}`}>
              <CarImage src={img} alt="" className="h-14 w-20" />
            </button>
          ))}
        </div>
      )}

      {/* Kopf */}
      <div className="mt-4">
        <p className="flex items-center gap-1.5 text-[12.5px] text-faint">
          <MapPin className="h-3.5 w-3.5" /> {car.city}{car.color ? ` · ${car.color}` : ""}
        </p>
        <h1 className="mt-1 text-[24px] font-bold leading-tight">{car.make} {car.model}</h1>
        {car.variant && <p className="text-[14px] text-sub">{car.variant}</p>}
        <div className="mt-2 flex items-center gap-3">
          <span className="text-[28px] font-extrabold tracking-tight text-gold">{eur(car.price)}</span>
          {car.accident === "unfallfrei" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[12px] font-semibold text-emerald-400"><Check className="h-3.5 w-3.5" /> Unfallfrei</span>
          ) : car.accident === "Unfallschaden" ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-1 text-[12px] font-semibold text-amber-400"><AlertTriangle className="h-3.5 w-3.5" /> Vorschaden</span>
          ) : null}
        </div>
      </div>

      {/* Specs */}
      <div className="mt-5 grid grid-cols-3 gap-2">
        {specs.map((s) => (
          <div key={s.label} className="surface p-3">
            <s.icon className="h-4 w-4 text-faint" />
            <p className="mt-1.5 text-[10.5px] uppercase tracking-wide text-faint">{s.label}</p>
            <p className="text-[13.5px] font-semibold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Beschreibung */}
      <h2 className="mb-2 mt-6 text-[17px] font-bold">Beschreibung</h2>
      <p className="whitespace-pre-line text-[14.5px] leading-relaxed text-ink/80">{car.description}</p>

      {/* Ausstattung */}
      {car.features.length > 0 && (
        <>
          <h2 className="mb-2 mt-6 text-[17px] font-bold">Ausstattung</h2>
          <div className="flex flex-wrap gap-2">
            {car.features.map((f) => (
              <span key={f} className="chip px-2.5 py-1 text-[12.5px]"><Check className="h-3.5 w-3.5 text-gold" /> {f}</span>
            ))}
          </div>
        </>
      )}

      {/* Verkäufer */}
      <div className="surface mt-6 flex items-center gap-3 p-4">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-gold to-gold-deep font-bold text-black">
          {car.seller.name.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[15px] font-semibold">{car.seller.name} {car.seller.verified && <BadgeCheck className="h-4 w-4 text-gold" />}</p>
          <p className="text-[12.5px] text-sub">{car.seller.type} · Wuppertal & Region</p>
        </div>
      </div>

      {/* Sticky Kontakt-Leiste */}
      <div className="fixed inset-x-0 bottom-[60px] z-30 border-t border-hair bg-bg/95 backdrop-blur-xl">
        <div className="app-x grid grid-cols-2 gap-2.5 py-3">
          <a href="tel:020282690" className="btn-gold h-12"><Phone className="h-4.5 w-4.5" /> Anrufen</a>
          <button className="btn-soft h-12"><MessageSquareText className="h-4.5 w-4.5" /> Nachricht</button>
        </div>
      </div>
      <div className="h-16" />
    </div>
  );
}
