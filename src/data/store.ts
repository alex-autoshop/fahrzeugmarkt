import { useSyncExternalStore } from "react";
import type { Car } from "./types";
import { SAMPLE_CARS } from "./cars";

const CARS_KEY = "karo-cars-v1";

// ── Fahrzeug-Store (persistiert in localStorage) ───────────────
function loadCars(): Car[] {
  try {
    const raw = localStorage.getItem(CARS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return [...SAMPLE_CARS];
}

let cars: Car[] = loadCars();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(CARS_KEY, JSON.stringify(cars));
  } catch {
    /* z.B. Quota überschritten — Inhalt bleibt im Speicher */
  }
}
function emit() {
  persist();
  listeners.forEach((l) => l());
}

export const carStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getSnapshot() {
    return cars;
  },
  add(car: Car) {
    cars = [car, ...cars];
    emit();
  },
  addMany(items: Car[]) {
    cars = [...items, ...cars];
    emit();
  },
  update(id: string, patch: Partial<Car>) {
    cars = cars.map((c) => (c.id === id ? { ...c, ...patch } : c));
    emit();
  },
  remove(id: string) {
    cars = cars.filter((c) => c.id !== id);
    emit();
  },
  byId(id: string) {
    return cars.find((c) => c.id === id);
  },
  reset() {
    cars = [...SAMPLE_CARS];
    emit();
  },
};

export function useCars() {
  return useSyncExternalStore(carStore.subscribe, carStore.getSnapshot);
}

// ── Händler-Profil (persistiert) ───────────────────────────────
const DEALER_KEY = "karo-dealer-v1";

export interface DealerProfile {
  name: string;
  city: string;
  phone: string;
  type: "Händler" | "Privat";
}

const DEFAULT_DEALER: DealerProfile = {
  name: "Salem Automobile",
  city: "Wuppertal",
  phone: "0202 82690",
  type: "Händler",
};

function loadDealer(): DealerProfile {
  try {
    const raw = localStorage.getItem(DEALER_KEY);
    if (raw) return { ...DEFAULT_DEALER, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return DEFAULT_DEALER;
}

let dealer = loadDealer();
const dealerListeners = new Set<() => void>();

export const dealerStore = {
  subscribe(l: () => void) {
    dealerListeners.add(l);
    return () => dealerListeners.delete(l);
  },
  getSnapshot() {
    return dealer;
  },
  set(patch: Partial<DealerProfile>) {
    dealer = { ...dealer, ...patch };
    try { localStorage.setItem(DEALER_KEY, JSON.stringify(dealer)); } catch { /* ignore */ }
    dealerListeners.forEach((l) => l());
  },
};

export function useDealer() {
  return useSyncExternalStore(dealerStore.subscribe, dealerStore.getSnapshot);
}
