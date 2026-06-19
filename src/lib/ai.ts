import type { Car, Fuel, Gearbox } from "@/data/types";

export type Draft = Partial<Car>;

const MAKES = [
  "VW", "Volkswagen", "BMW", "Mercedes", "Mercedes-Benz", "Audi", "Opel", "Ford",
  "Nissan", "Toyota", "Renault", "Peugeot", "Citroën", "Citroen", "Fiat", "Seat",
  "Skoda", "Škoda", "Hyundai", "Kia", "Mazda", "Honda", "Volvo", "Tesla", "Mini",
  "Porsche", "Dacia", "Suzuki", "Mitsubishi", "Jeep", "Land Rover", "Jaguar",
  "Smart", "Alfa Romeo", "Alfa", "Chevrolet", "Cupra", "DS",
];

const COLORS = [
  "schwarz", "weiß", "weiss", "grau", "silber", "anthrazit", "blau", "rot",
  "grün", "gelb", "orange", "braun", "beige", "gold", "violett", "hellblau",
  "dunkelblau", "bordeaux",
];

const FEATURE_MAP: Record<string, string> = {
  klimaautomatik: "Klimaautomatik",
  klimaanlage: "Klimaanlage",
  klima: "Klimaanlage",
  navi: "Navigation",
  navigation: "Navigation",
  sitzheizung: "Sitzheizung",
  alufelgen: "Alufelgen",
  alu: "Alufelgen",
  bluetooth: "Bluetooth",
  leder: "Lederausstattung",
  lederlenkrad: "Lederlenkrad",
  panorama: "Panoramadach",
  panoramadach: "Panoramadach",
  schiebedach: "Schiebedach",
  klappdach: "Elektr. Klappdach",
  cabrio: "Cabrio",
  ahk: "Anhängerkupplung",
  anhängerkupplung: "Anhängerkupplung",
  tempomat: "Tempomat",
  acc: "Abstandstempomat",
  led: "LED-Scheinwerfer",
  xenon: "Xenon",
  pdc: "Einparkhilfe",
  einparkhilfe: "Einparkhilfe",
  rückfahrkamera: "Rückfahrkamera",
  standheizung: "Standheizung",
  headup: "Head-Up-Display",
  isofix: "Isofix",
};

function detectFuel(t: string): Fuel | undefined {
  if (/\b(elektro|elektrisch|electric|ev|stromer)\b/.test(t)) return "Elektro";
  if (/\b(hybrid|phev)\b/.test(t)) return "Hybrid";
  if (/\b(diesel|tdi|cdi|hdi|dci)\b/.test(t)) return "Diesel";
  if (/\b(lpg|autogas|gas)\b/.test(t)) return "LPG";
  if (/\b(benzin|benziner|petrol|tsi|tfsi|vti)\b/.test(t)) return "Benzin";
  return undefined;
}

function detectGearbox(t: string): Gearbox | undefined {
  if (/\b(automatik|automatic|dsg|tiptronic|s-tronic|wandler)\b/.test(t)) return "Automatik";
  if (/\b(schalter|schaltgetriebe|manuell|handschalter|gang-schalt)\b/.test(t)) return "Schaltgetriebe";
  return undefined;
}

function detectYear(t: string): number | undefined {
  // Bj 07 / baujahr 2007 / 2007
  const bjShort = t.match(/\b(?:bj|baujahr|ez)\.?\s*'?(\d{2})\b/);
  if (bjShort) {
    const n = parseInt(bjShort[1], 10);
    return n > 50 ? 1900 + n : 2000 + n;
  }
  const full = t.match(/\b(19[89]\d|20[0-3]\d)\b/);
  if (full) return parseInt(full[1], 10);
  return undefined;
}

function detectMileage(t: string): number | undefined {
  // "186 tkm" / "186tkm"
  const tkm = t.match(/\b(\d{1,3})\s*(?:t\.?\s*km|tkm|tausend km)\b/);
  if (tkm) return parseInt(tkm[1], 10) * 1000;
  // "186.000 km" / "186000 km" / "186 000 km"
  const km = t.match(/\b(\d{1,3}(?:[.\s]\d{3})+|\d{4,6})\s*km\b/);
  if (km) return parseInt(km[1].replace(/[.\s]/g, ""), 10);
  return undefined;
}

function detectPrice(t: string): number | undefined {
  // "2.290 €" / "2290€" / "2290 euro" / "2.5k" handled simply
  const eur = t.match(/(\d{1,3}(?:[.\s]\d{3})+|\d{3,6})\s*(?:€|eur|euro)\b/);
  if (eur) return parseInt(eur[1].replace(/[.\s]/g, ""), 10);
  const kpr = t.match(/\b(\d{1,2}(?:[.,]\d)?)\s*k\b/);
  if (kpr) return Math.round(parseFloat(kpr[1].replace(",", ".")) * 1000);
  return undefined;
}

function detectPower(t: string): number | undefined {
  const ps = t.match(/\b(\d{2,3})\s*ps\b/);
  if (ps) return parseInt(ps[1], 10);
  const kw = t.match(/\b(\d{2,3})\s*kw\b/);
  if (kw) return Math.round(parseInt(kw[1], 10) * 1.359);
  return undefined;
}

function detectTuev(t: string): string | undefined {
  if (/\b(tüv|tuv|hu)\s*(neu|frisch|neuer)\b/.test(t)) return "neu";
  if (/\b(kein|ohne|abgelaufen|abgelaufener)\s*(tüv|tuv|hu)\b|\b(tüv|tuv|hu)\s*(abgelaufen|fehlt)\b/.test(t))
    return "abgelaufen";
  const date = t.match(/\b(?:tüv|tuv|hu)\s*(?:bis)?\s*(\d{1,2}\/\d{2,4})\b/);
  if (date) return date[1];
  return undefined;
}

function detectAccident(t: string): Car["accident"] | undefined {
  if (/\bunfallfrei\b/.test(t)) return "unfallfrei";
  if (/\b(unfall|unfallschaden|unfallwagen|hatte (?:einen )?unfall|beschädigt)\b/.test(t))
    return "Unfallschaden";
  return undefined;
}

function detectMakeModel(raw: string, t: string): { make?: string; model?: string } {
  for (const make of MAKES) {
    const idx = t.indexOf(make.toLowerCase());
    if (idx === -1) continue;
    const canonical =
      make === "Volkswagen" ? "VW" : make === "Mercedes-Benz" ? "Mercedes" : make === "Alfa" ? "Alfa Romeo" : make;
    // Modell = nächste 1–2 sinnvolle Tokens nach der Marke
    const after = raw.slice(idx + make.length).trim();
    const tokens = after.split(/[\s,.]+/).filter(Boolean);
    const stop = new Set(["bj", "baujahr", "ez", "mit", "für", "und", "der", "die", "das", "km", "ps", "euro", "€"]);
    const modelTokens: string[] = [];
    for (const tok of tokens) {
      const low = tok.toLowerCase();
      if (stop.has(low) || /^\d{4,}$/.test(tok) || /€|euro/.test(low)) break;
      modelTokens.push(tok);
      if (modelTokens.length >= 2) break;
    }
    return { make: canonical, model: modelTokens.join(" ") || undefined };
  }
  return {};
}

function detectColor(t: string): string | undefined {
  for (const c of COLORS) {
    if (t.includes(c)) return c.charAt(0).toUpperCase() + c.slice(1).replace("weiss", "Weiß");
  }
  return undefined;
}

function detectFeatures(t: string): string[] {
  const found = new Set<string>();
  for (const key in FEATURE_MAP) {
    if (t.includes(key)) found.add(FEATURE_MAP[key]);
  }
  // Klimaautomatik schlägt einfache Klimaanlage (sonst doppelt)
  if (found.has("Klimaautomatik")) found.delete("Klimaanlage");
  return [...found];
}

/** Extrahiert strukturierte Fahrzeugdaten aus einem freien Satz (DE). */
export function parseListing(input: string): Draft {
  const raw = input.trim();
  const t = raw.toLowerCase();
  const draft: Draft = {};

  const { make, model } = detectMakeModel(raw, t);
  if (make) draft.make = make;
  if (model) draft.model = model;

  const year = detectYear(t);
  if (year) draft.year = year;
  const mileage = detectMileage(t);
  if (mileage) draft.mileage = mileage;
  const price = detectPrice(t);
  if (price) draft.price = price;
  const fuel = detectFuel(t);
  if (fuel) draft.fuel = fuel;
  const gearbox = detectGearbox(t);
  if (gearbox) draft.gearbox = gearbox;
  const power = detectPower(t);
  if (power) draft.power = power;
  const tuev = detectTuev(t);
  if (tuev) draft.tuevUntil = tuev;
  const accident = detectAccident(t);
  if (accident) draft.accident = accident;
  const color = detectColor(t);
  if (color) draft.color = color;
  const features = detectFeatures(t);
  if (features.length) draft.features = features;

  return draft;
}

export function mergeDraft(a: Draft, b: Draft): Draft {
  return {
    ...a,
    ...b,
    features: Array.from(new Set([...(a.features ?? []), ...(b.features ?? [])])),
  };
}

// --- Konversation: nächste fehlende Pflichtangabe bestimmen ---

type Step = { field: keyof Draft; prompt: string; done: (d: Draft) => boolean };

const STEPS: Step[] = [
  { field: "make", prompt: "Welche **Marke und welches Modell** ist es? (z. B. „VW Golf“)", done: (d) => !!d.make },
  { field: "year", prompt: "Aus welchem **Baujahr** stammt das Auto?", done: (d) => !!d.year },
  { field: "mileage", prompt: "Wie viele **Kilometer** ist es gelaufen?", done: (d) => !!d.mileage },
  { field: "price", prompt: "Zu welchem **Preis** möchtest du es anbieten?", done: (d) => !!d.price },
  { field: "fuel", prompt: "**Benzin, Diesel, Elektro oder Hybrid?**", done: (d) => !!d.fuel },
  { field: "gearbox", prompt: "**Schaltgetriebe oder Automatik?**", done: (d) => !!d.gearbox },
  { field: "accident", prompt: "Ist das Auto **unfallfrei** — oder gab es einen Unfall?", done: (d) => !!d.accident },
];

export function nextStep(d: Draft): Step | null {
  return STEPS.find((s) => !s.done(d)) ?? null;
}

export function isComplete(d: Draft): boolean {
  return nextStep(d) === null;
}

export function progress(d: Draft): number {
  const done = STEPS.filter((s) => s.done(d)).length;
  return Math.round((done / STEPS.length) * 100);
}

const fuelEmoji: Record<string, string> = {
  Benzin: "⛽️", Diesel: "🛢️", Elektro: "⚡️", Hybrid: "🔋", LPG: "💨",
};

/** Freundliche Bestätigung, was gerade erkannt wurde. */
export function ackReply(justExtracted: Draft): string {
  const bits: string[] = [];
  if (justExtracted.make) bits.push(`**${justExtracted.make}${justExtracted.model ? " " + justExtracted.model : ""}**`);
  if (justExtracted.year) bits.push(`Bj. ${justExtracted.year}`);
  if (justExtracted.mileage) bits.push(`${justExtracted.mileage.toLocaleString("de-DE")} km`);
  if (justExtracted.price) bits.push(`${justExtracted.price.toLocaleString("de-DE")} €`);
  if (justExtracted.fuel) bits.push(`${fuelEmoji[justExtracted.fuel] ?? ""} ${justExtracted.fuel}`);
  if (justExtracted.gearbox) bits.push(justExtracted.gearbox);
  if (justExtracted.power) bits.push(`${justExtracted.power} PS`);
  if (justExtracted.tuevUntil) bits.push(`TÜV ${justExtracted.tuevUntil}`);
  if (justExtracted.accident) bits.push(justExtracted.accident);
  if (justExtracted.color) bits.push(justExtracted.color);
  if (justExtracted.features?.length) bits.push(justExtracted.features.join(", "));
  if (!bits.length) return "";
  return `Verstanden 👍 — ${bits.join(" · ")}.`;
}

/** Baut eine schöne Beschreibung aus dem Draft, falls keine eigene da ist. */
export function autoDescription(d: Draft): string {
  const parts: string[] = [];
  const title = `${d.make ?? ""} ${d.model ?? ""}`.trim();
  if (title) parts.push(`${title}${d.year ? `, Baujahr ${d.year}` : ""}.`);
  const facts: string[] = [];
  if (d.mileage) facts.push(`${d.mileage.toLocaleString("de-DE")} km`);
  if (d.fuel) facts.push(d.fuel);
  if (d.gearbox) facts.push(d.gearbox);
  if (d.power) facts.push(`${d.power} PS`);
  if (facts.length) parts.push(facts.join(" · ") + ".");
  if (d.features?.length) parts.push("Ausstattung: " + d.features.join(", ") + ".");
  if (d.accident) parts.push(d.accident === "unfallfrei" ? "Unfallfrei." : "Mit Vorschaden — ehrlich angegeben.");
  if (d.tuevUntil) parts.push(d.tuevUntil === "neu" ? "TÜV neu." : d.tuevUntil === "abgelaufen" ? "TÜV abgelaufen." : `TÜV bis ${d.tuevUntil}.`);
  parts.push("Besichtigung & Probefahrt jederzeit möglich.");
  return parts.join(" ");
}
