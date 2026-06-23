export type Fuel = "Benzin" | "Diesel" | "Elektro" | "Hybrid" | "LPG";
export type Gearbox = "Schaltgetriebe" | "Automatik";
export type Status = "aktiv" | "verkauft" | "entwurf";

export interface Car {
  status?: Status; // default "aktiv"
  id: string;
  make: string;
  model: string;
  variant?: string;
  year: number;
  price: number;
  mileage: number; // km
  fuel: Fuel;
  gearbox: Gearbox;
  power?: number; // PS
  tuevUntil?: string; // "neu" | "abgelaufen" | "08/2026"
  accident: "unfallfrei" | "Unfallschaden" | "unbekannt";
  city: string;
  color?: string;
  features: string[];
  description: string;
  images: string[]; // urls oder object-urls
  seller: {
    name: string;
    type: "Privat" | "Händler";
    verified: boolean;
  };
  createdAt: number;
}
