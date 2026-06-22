import { useSyncExternalStore } from "react";

const KEY = "karo-favorites";

function load(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

let ids = new Set<string>(load());
const listeners = new Set<() => void>();
let snapshot: string[] = [...ids];

function emit() {
  snapshot = [...ids];
  try {
    localStorage.setItem(KEY, JSON.stringify(snapshot));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export const favStore = {
  subscribe(l: () => void) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getSnapshot() {
    return snapshot;
  },
  toggle(id: string) {
    ids.has(id) ? ids.delete(id) : ids.add(id);
    emit();
  },
  has(id: string) {
    return ids.has(id);
  },
};

export function useFavorites() {
  return useSyncExternalStore(favStore.subscribe, favStore.getSnapshot);
}
