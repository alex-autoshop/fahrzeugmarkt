import type { Car, Fuel, Gearbox } from "@/data/types";
import type { DealerProfile } from "@/data/store";

export interface ImportReport {
  total: number;
  imported: number;
  skipped: number;
  warnings: string[];
  unmapped: string[]; // Spalten, die nicht zugeordnet wurden
}

// ── CSV-Parser (robust: ; , oder Tab, Anführungszeichen, Zeilenumbrüche) ──
export function parseCSV(text: string): { headers: string[]; rows: string[][] } {
  const clean = text.replace(/^﻿/, ""); // BOM entfernen
  const firstLine = clean.slice(0, clean.indexOf("\n") > -1 ? clean.indexOf("\n") : clean.length);
  // Delimiter anhand der Kopfzeile raten
  const counts: Record<string, number> = {
    ";": (firstLine.match(/;/g) || []).length,
    ",": (firstLine.match(/,/g) || []).length,
    "\t": (firstLine.match(/\t/g) || []).length,
  };
  const delim = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[1] ?? 0) > 0
    ? Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
    : ";";

  const rows: string[][] = [];
  let field = "";
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const ch = clean[i];
    if (inQuotes) {
      if (ch === '"') {
        if (clean[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === delim) {
      row.push(field); field = "";
    } else if (ch === "\n") {
      row.push(field); field = "";
      if (row.some((c) => c.trim() !== "")) rows.push(row);
      row = [];
    } else if (ch === "\r") {
      /* skip */
    } else field += ch;
  }
  if (field !== "" || row.length) { row.push(field); if (row.some((c) => c.trim() !== "")) rows.push(row); }

  const headers = (rows.shift() ?? []).map((h) => h.trim());
  return { headers, rows };
}

// ── Spalten-Synonyme → Feld ──────────────────────────────────
const norm = (s: string) => s.toLowerCase().replace(/[\s_().\-/]/g, "");

const FIELD_SYNONYMS: Record<string, string[]> = {
  make: ["marke", "hersteller", "make", "brand", "fabrikat"],
  model: ["modell", "model", "typ", "baureihe", "modellname"],
  variant: ["variante", "ausfuhrung", "ausführung", "version", "variant", "trim", "ausstattungslinie"],
  year: ["erstzulassung", "ez", "baujahr", "year", "jahr", "zulassung", "erstzul"],
  price: ["preis", "price", "vk", "verkaufspreis", "kaufpreis", "betrag", "vkpreis", "bruttopreis"],
  mileage: ["kilometer", "km", "laufleistung", "mileage", "kmstand", "kilometerstand", "kmgesamt"],
  fuel: ["kraftstoff", "treibstoff", "fuel", "kraftstoffart", "antrieb", "antriebsart"],
  gearbox: ["getriebe", "schaltung", "gearbox", "transmission", "getriebeart"],
  power: ["leistung", "ps", "power", "hp", "leistungps", "leistungkw", "kw"],
  color: ["farbe", "color", "aussenfarbe", "außenfarbe", "lackierung", "aussenfarbecode"],
  tuev: ["tuv", "tüv", "hu", "hauptuntersuchung", "tuevbis", "hubis"],
  accident: ["unfall", "unfallfrei", "accident", "schaden", "unfallschaden"],
  description: ["beschreibung", "description", "bemerkung", "text", "info", "fahrzeugbeschreibung", "details"],
  images: ["bilder", "bild", "fotos", "foto", "images", "image", "bildurl", "imageurls", "bilderurls", "picture"],
  city: ["ort", "stadt", "standort", "city", "plzort", "standortort"],
  features: ["ausstattung", "features", "extras", "sonderausstattung", "equipment"],
};

function buildColumnMap(headers: string[]): { map: Record<string, number>; unmapped: string[] } {
  const map: Record<string, number> = {};
  const unmapped: string[] = [];
  headers.forEach((h, idx) => {
    const n = norm(h);
    let matched = false;
    for (const [field, syns] of Object.entries(FIELD_SYNONYMS)) {
      if (field in map) continue;
      if (syns.some((s) => n === s || n.includes(s))) { map[field] = idx; matched = true; break; }
    }
    if (!matched && h.trim()) unmapped.push(h);
  });
  return { map, unmapped };
}

// ── Wert-Normalisierung ──────────────────────────────────────
function toInt(v: string): number | undefined {
  if (!v) return undefined;
  const digits = v.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : undefined;
}
function toYear(v: string): number | undefined {
  if (!v) return undefined;
  const m = v.match(/(19[89]\d|20[0-3]\d)/);
  if (m) return parseInt(m[1], 10);
  const short = v.match(/\b(\d{2})\b/);
  if (short) { const n = +short[1]; return n > 50 ? 1900 + n : 2000 + n; }
  return undefined;
}
function toFuel(v: string): Fuel {
  const t = v.toLowerCase();
  if (/elektro|electric|ev|strom/.test(t)) return "Elektro";
  if (/hybrid|phev/.test(t)) return "Hybrid";
  if (/diesel|tdi|cdi|hdi/.test(t)) return "Diesel";
  if (/lpg|autogas|cng|gas/.test(t)) return "LPG";
  return "Benzin";
}
function toGearbox(v: string): Gearbox {
  return /automat|dsg|tiptronic|s-?tronic|wandler|cvt/i.test(v) ? "Automatik" : "Schaltgetriebe";
}
function toPower(v: string, headerWasKw: boolean): number | undefined {
  if (!v) return undefined;
  const ps = v.match(/(\d{2,3})\s*ps/i);
  if (ps) return parseInt(ps[1], 10);
  const kw = v.match(/(\d{2,3})\s*kw/i);
  if (kw) return Math.round(parseInt(kw[1], 10) * 1.359);
  const num = toInt(v);
  if (num === undefined) return undefined;
  return headerWasKw ? Math.round(num * 1.359) : num;
}
function toImages(v: string): string[] {
  if (!v) return [];
  return v.split(/[|,;\s]+/).map((s) => s.trim()).filter((s) => /^https?:\/\//.test(s));
}
function toAccident(v: string): Car["accident"] {
  const t = v.toLowerCase();
  if (/unfallfrei|kein|nein|false|0/.test(t)) return "unfallfrei";
  if (/unfall|schaden|ja|true|1/.test(t)) return "Unfallschaden";
  return "unbekannt";
}

let counter = 0;
const newId = () => `imp-${Date.now().toString(36)}-${(counter++).toString(36)}`;

// ── Hauptfunktion ────────────────────────────────────────────
export function importCarsFromCSV(text: string, dealer: DealerProfile): { cars: Car[]; report: ImportReport } {
  const { headers, rows } = parseCSV(text);
  const { map, unmapped } = buildColumnMap(headers);
  const warnings: string[] = [];
  const cars: Car[] = [];
  const get = (row: string[], field: string) => (field in map ? (row[map[field]] ?? "").trim() : "");
  const powerHeaderKw = "power" in map ? /kw/i.test(headers[map.power] ?? "") : false;

  if (!("make" in map) && !("model" in map)) {
    warnings.push("Keine Marken-/Modellspalte erkannt — bitte Spaltennamen prüfen (z. B. „Marke“, „Modell“).");
  }

  rows.forEach((row, i) => {
    const make = get(row, "make");
    const model = get(row, "model");
    const price = toInt(get(row, "price"));
    if (!make && !model) { warnings.push(`Zeile ${i + 2}: übersprungen (keine Marke/Modell).`); return; }

    const featuresRaw = get(row, "features");
    cars.push({
      id: newId(),
      make: make || "Fahrzeug",
      model,
      year: toYear(get(row, "year")) ?? 0,
      price: price ?? 0,
      mileage: toInt(get(row, "mileage")) ?? 0,
      fuel: toFuel(get(row, "fuel")),
      gearbox: toGearbox(get(row, "gearbox")),
      power: toPower(get(row, "power"), powerHeaderKw),
      tuevUntil: get(row, "tuev") || undefined,
      accident: toAccident(get(row, "accident")),
      city: get(row, "city") || dealer.city,
      color: get(row, "color") || undefined,
      features: featuresRaw ? featuresRaw.split(/[|,;]+/).map((s) => s.trim()).filter(Boolean) : [],
      description: get(row, "description") || `${make} ${model} — Inserat von ${dealer.name}.`,
      images: toImages(get(row, "images")),
      seller: { name: dealer.name, type: dealer.type, verified: dealer.type === "Händler" },
      status: "aktiv",
      createdAt: Date.now() - i * 1000,
    });
    if (price === undefined) warnings.push(`Zeile ${i + 2}: kein Preis erkannt (auf 0 gesetzt).`);
  });

  return {
    cars,
    report: { total: rows.length, imported: cars.length, skipped: rows.length - cars.length, warnings, unmapped },
  };
}

// ── Beispiel-CSV (zum Download / Demo) ───────────────────────
export const SAMPLE_CSV = `Marke;Modell;Variante;Erstzulassung;Preis;Kilometer;Kraftstoff;Getriebe;Leistung;Farbe;TÜV;Unfall;Bilder;Beschreibung
VW;Golf VII;1.4 TSI Comfortline;06/2015;11900;98000;Benzin;Schaltgetriebe;125 PS;Weiß;05/2026;unfallfrei;https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=1200;Scheckheftgepflegt, Nichtraucher.
BMW;320d;Touring M Sport;03/2018;23450;112400;Diesel;Automatik;190 PS;Schwarz;neu;unfallfrei;https://images.unsplash.com/photo-1555215695-3004980ad54e?w=1200;Voll ausgestattet, frischer TÜV.
Audi;A3 Sportback;35 TFSI S line;2020;24800;47000;Benzin;Automatik;150 PS;Grau;03/2026;unfallfrei;;Sehr gepflegt, scheckheftgepflegt bei Audi.
Opel;Corsa;1.2 Edition;2019;9990;61000;Benzin;Schaltgetriebe;75 PS;Rot;11/2025;unfallfrei;;Idealer Erstwagen, wenig Kilometer.
Mercedes;A 180;Style;2017;16500;83000;Benzin;Automatik;122 PS;Silber;neu;unfallfrei;;Klimaautomatik, Navi, top Zustand.`;
