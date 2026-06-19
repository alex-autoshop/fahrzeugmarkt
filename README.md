# Karo — Fahrzeugmarkt für Wuppertal & NRW

Der schnelle, KI-gestützte Auto-Marktplatz. Konkurrent zu mobile.de — zunächst fokussiert
auf Wuppertal und NRW. Apple-inspiriertes UI, schneller und einfacher als bestehende Portale.

## Das Killer-Feature: Inserieren per KI-Chat

Statt 30 Felder auszufüllen, beschreibt der Verkäufer sein Auto in **einem Satz** und lädt
Fotos hoch. Die KI extrahiert automatisch Marke, Modell, Baujahr, Kilometer, Preis, Kraftstoff,
Getriebe, TÜV, Unfallstatus und Ausstattung — und baut daraus ein fertiges Inserat.

> „Nissan Micra C+C, Bj 2007, 185000 km, Benziner, Schalter, TÜV abgelaufen, 2290 Euro, Klimaautomatik, unfallfrei"
> → vollständiges Inserat in Sekunden.

## Tech

- React 18 + Vite 5 + TypeScript
- Tailwind CSS (Apple-Designsystem in `tailwind.config.js` + `index.css`)
- Framer Motion (Animationen), React Router, Lucide Icons
- KI-Parser: `src/lib/ai.ts` (regelbasiert, DE) — vorbereitet für Anschluss an Claude API

## Starten

```bash
npm install
npm run dev      # http://localhost:5180
npm run build
```

## Struktur

```
src/
├── pages/        Home (Markt + Filter), CarDetail, Sell (KI-Chat)
├── components/   Header, CarCard, CarImage
├── data/         types, cars (Beispiel-Inserate NRW), store (Pub/Sub)
└── lib/          ai (Inserat-Extraktion + Chat-Logik), format
```

## Nächste Schritte

- [ ] Echten Claude-Endpoint an `src/lib/ai.ts` anbinden (Foto-Analyse: Schäden/Modell erkennen)
- [ ] Supabase für Inserate + Auth + Foto-Upload (aktuell In-Memory)
- [ ] Karten-/Umkreissuche (NRW), Favoriten, Chat zwischen Käufer & Verkäufer
- [ ] Eigene Domain & Deployment
