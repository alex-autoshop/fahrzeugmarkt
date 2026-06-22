import { Link } from "react-router-dom";
import { Heart, MapPin, BadgeCheck } from "lucide-react";
import type { Car } from "@/data/types";
import { eur, km } from "@/lib/format";
import { favStore, useFavorites } from "@/data/favorites";
import { CarImage } from "./CarImage";

export function CarCard({ car }: { car: Car }) {
  const favs = useFavorites();
  const liked = favs.includes(car.id);
  const isNew = Date.now() - car.createdAt < 1000 * 60 * 60 * 24;

  const specs = [
    String(car.year),
    car.fuel,
    car.power ? `${car.power} PS` : null,
    km(car.mileage),
    car.gearbox === "Automatik" ? "Automatik" : "Schaltung",
  ].filter(Boolean) as string[];

  return (
    <Link to={`/auto/${car.id}`} className="block">
      <div className="relative overflow-hidden rounded-2xl">
        <CarImage src={car.images[0]} alt={`${car.make} ${car.model}`} className="aspect-[16/11]" />
        <button
          onClick={(e) => { e.preventDefault(); favStore.toggle(car.id); }}
          className="absolute right-2.5 top-2.5 grid h-9 w-9 place-items-center rounded-full bg-black/50 backdrop-blur transition-transform active:scale-90"
          aria-label="Merken"
        >
          <Heart className={`h-5 w-5 ${liked ? "fill-gold text-gold" : "text-white"}`} />
        </button>
      </div>

      <div className="pt-2.5">
        <div className="mb-1 flex items-center gap-2">
          {isNew && (
            <span className="rounded-md bg-gold px-1.5 py-0.5 text-[11px] font-bold uppercase italic text-black">
              Neu
            </span>
          )}
          <h3 className="truncate text-[15px] font-semibold">{car.make} {car.model}</h3>
        </div>
        <p className="text-[19px] font-bold tracking-tight">{eur(car.price)}</p>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {specs.map((s, i) => (
            <span key={i} className="rounded-md bg-white/[0.06] px-2 py-0.5 text-[12px] text-sub">{s}</span>
          ))}
        </div>

        <p className="mt-2 flex items-center gap-1 text-[12.5px] text-faint">
          <MapPin className="h-3.5 w-3.5" /> {car.city}
          {car.seller.verified && (
            <span className="ml-1 inline-flex items-center gap-0.5 text-gold/80">
              <BadgeCheck className="h-3.5 w-3.5" /> {car.seller.type}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}
