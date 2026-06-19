import { useSyncExternalStore } from "react";
import type { Car } from "./types";
import { SAMPLE_CARS } from "./cars";

// Einfacher In-Memory-Store mit Pub/Sub. Neu erstellte Inserate landen vorne.
let cars: Car[] = [...SAMPLE_CARS];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const carStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot() {
    return cars;
  },
  add(car: Car) {
    cars = [car, ...cars];
    emit();
  },
  byId(id: string) {
    return cars.find((c) => c.id === id);
  },
};

export function useCars() {
  return useSyncExternalStore(carStore.subscribe, carStore.getSnapshot);
}
