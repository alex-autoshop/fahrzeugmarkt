import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft, BadgeCheck, Gauge, Calendar, Fuel, Cog, Zap, ShieldCheck,
  MapPin, Phone, MessageCircle, Check, AlertTriangle,
} from "lucide-react";
import { carStore } from "@/data/store";
import { eur, km } from "@/lib/format";
import { CarImage } from "@/components/CarImage";

export default function CarDetail() {
  const { id } = useParams();
  const car = id ? carStore.byId(id) : undefined;
  const [active, setActive] = useState(0);

  if (!car) {
    return (
      <div className="container-x py-24 text-center">
        <p className="text-sub">Dieses Inserat gibt es nicht (mehr).</p>
        <Link to="/" className="btn-ghost mt-4">Zurück zum Markt</Link>
      </div>
    );
  }

  const specs = [
    { icon: Calendar, label: "Baujahr", value: String(car.year) },
    { icon: Gauge, label: "Kilometer", value: km(car.mileage) },
    { icon: Fuel, label: "Kraftstoff", value: car.fuel },
    { icon: Cog, label: "Getriebe", value: car.gearbox },
    ...(car.power ? [{ icon: Zap, label: "Leistung", value: `${car.power} PS` }] : []),
    { icon: ShieldCheck, label: "TÜV", value: car.tuevUntil ?? "—" },
  ];

  return (
    <div className="container-x py-6 sm:py-10">
      <Link to="/" className="mb-5 inline-flex items-center gap-1.5 text-[14px] font-medium text-sub hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Markt
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Galerie */}
        <div>
          <CarImage
            src={car.images[active]}
            alt={`${car.make} ${car.model}`}
            className="aspect-[4/3] w-full rounded-3xl shadow-soft"
          />
          {car.images.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {car.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`shrink-0 overflow-hidden rounded-xl ring-2 transition-all ${
                    active === i ? "ring-accent" : "ring-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <CarImage src={img} alt="" className="h-16 w-24" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="lg:pt-1">
          <div className="flex items-center gap-2 text-[13px] text-sub">
            <MapPin className="h-3.5 w-3.5" /> {car.city}
            {car.color && <span>· {car.color}</span>}
          </div>
          <h1 className="mt-1 text-[28px] font-semibold leading-tight tracking-tight sm:text-[34px]">
            {car.make} {car.model}
          </h1>
          {car.variant && <p className="text-[15px] text-sub">{car.variant}</p>}

          <div className="mt-4 flex items-end gap-3">
            <span className="text-[34px] font-semibold tracking-tight">{eur(car.price)}</span>
            {car.accident === "unfallfrei" ? (
              <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-semibold text-emerald-600">
                <Check className="h-3.5 w-3.5" /> Unfallfrei
              </span>
            ) : car.accident === "Unfallschaden" ? (
              <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[12px] font-semibold text-amber-600">
                <AlertTriangle className="h-3.5 w-3.5" /> Vorschaden
              </span>
            ) : null}
          </div>

          {/* Specs grid */}
          <div className="mt-6 grid grid-cols-2 gap-2.5">
            {specs.map((s) => (
              <div key={s.label} className="rounded-xl bg-black/[0.03] p-3">
                <s.icon className="h-4 w-4 text-sub" />
                <p className="mt-1.5 text-[11px] uppercase tracking-wide text-sub">{s.label}</p>
                <p className="text-[14px] font-semibold">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Seller + Kontakt */}
          <div className="card mt-6 p-4">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-ink text-white font-semibold">
                {car.seller.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-[15px] font-semibold">
                  {car.seller.name}
                  {car.seller.verified && <BadgeCheck className="h-4 w-4 text-accent" />}
                </p>
                <p className="text-[12.5px] text-sub">{car.seller.type} · Wuppertal & Region</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              <button className="btn-accent h-11 w-full text-[14px]">
                <Phone className="h-4 w-4" /> Anrufen
              </button>
              <button className="btn-ghost h-11 w-full text-[14px]">
                <MessageCircle className="h-4 w-4" /> Nachricht
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Beschreibung + Ausstattung */}
      <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <h2 className="mb-3 text-[19px] font-semibold">Beschreibung</h2>
          <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink/80">{car.description}</p>
        </div>
        {car.features.length > 0 && (
          <div>
            <h2 className="mb-3 text-[19px] font-semibold">Ausstattung</h2>
            <div className="flex flex-wrap gap-2">
              {car.features.map((f) => (
                <span key={f} className="chip bg-black/[0.04]">
                  <Check className="h-3.5 w-3.5 text-accent" /> {f}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
