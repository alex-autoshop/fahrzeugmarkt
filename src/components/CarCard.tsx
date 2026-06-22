import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BadgeCheck, Gauge, Calendar, Fuel, MapPin } from "lucide-react";
import type { Car } from "@/data/types";
import { eur, km, ago } from "@/lib/format";
import { CarImage } from "./CarImage";

export function CarCard({ car, index = 0 }: { car: Car; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.3), ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/auto/${car.id}`}
        className="group block overflow-hidden rounded-2xl bg-white border border-black/[0.06] shadow-soft transition-all duration-300 hover:shadow-lift hover:-translate-y-1"
      >
        <div className="relative">
          <CarImage src={car.images[0]} alt={`${car.make} ${car.model}`} className="aspect-[4/3]" />
          <div className="absolute left-3 top-3 flex gap-2">
            {car.tuevUntil === "neu" && (
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 backdrop-blur">
                TÜV neu
              </span>
            )}
            {car.fuel === "Elektro" && (
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-accent backdrop-blur">
                Elektro
              </span>
            )}
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-[15px] font-semibold">
                {car.make} {car.model}
              </h3>
              <p className="truncate text-[13px] text-sub">{car.variant ?? " "}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[17px] font-semibold tracking-tight">{eur(car.price)}</p>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[12.5px] text-sub">
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" /> {car.year}
            </span>
            <span className="inline-flex items-center gap-1">
              <Gauge className="h-3.5 w-3.5" /> {km(car.mileage)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Fuel className="h-3.5 w-3.5" /> {car.fuel}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-black/[0.05] pt-3 text-[12px] text-sub">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {car.city}
            </span>
            <span className="inline-flex items-center gap-1">
              {car.seller.verified && <BadgeCheck className="h-3.5 w-3.5 text-accent" />}
              {car.seller.name} · {ago(car.createdAt)}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
