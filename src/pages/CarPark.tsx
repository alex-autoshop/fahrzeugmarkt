import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import { useCars } from "@/data/store";
import { useFavorites } from "@/data/favorites";
import { CarCard } from "@/components/CarCard";

export default function CarPark() {
  const cars = useCars();
  const favs = useFavorites();
  const saved = cars.filter((c) => favs.includes(c.id));

  return (
    <div className="animate-fade-up">
      <h1 className="mb-4 text-[22px] font-bold">Merkliste</h1>

      {saved.length === 0 ? (
        <div className="surface mt-10 grid place-items-center px-6 py-16 text-center">
          <span className="mb-4 grid h-16 w-16 place-items-center rounded-full bg-white/[0.06]">
            <Heart className="h-8 w-8 text-faint" />
          </span>
          <p className="text-[16px] font-semibold">Noch nichts gemerkt</p>
          <p className="mt-1 max-w-[260px] text-[13px] text-sub">
            Tippe bei einem Auto auf das ♥, um es hier zu sammeln und nichts zu verpassen.
          </p>
          <Link to="/" className="btn-gold mt-5 h-11 px-5 text-[14px]">Fahrzeuge entdecken</Link>
        </div>
      ) : (
        <>
          <p className="mb-3 text-[13px] text-sub">{saved.length} gemerkt</p>
          <div className="grid grid-cols-2 gap-x-3 gap-y-5">
            {saved.map((car) => <CarCard key={car.id} car={car} />)}
          </div>
        </>
      )}
    </div>
  );
}
