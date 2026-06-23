import { useMemo, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Upload, FileSpreadsheet, Download, Sparkles, CheckCircle2,
  AlertTriangle, ChevronRight,
} from "lucide-react";
import { importCarsFromCSV, SAMPLE_CSV, type ImportReport } from "@/lib/import";
import { carStore, useDealer } from "@/data/store";
import { eur, km } from "@/lib/format";
import type { Car } from "@/data/types";

export default function Import() {
  const nav = useNavigate();
  const dealer = useDealer();
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const parsed = useMemo<{ cars: Car[]; report: ImportReport } | null>(() => {
    if (!text.trim()) return null;
    try {
      return importCarsFromCSV(text, dealer);
    } catch {
      return null;
    }
  }, [text, dealer]);

  function onFile(file?: File) {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setText(String(reader.result || ""));
    reader.readAsText(file, "utf-8");
  }

  function downloadSample() {
    const blob = new Blob([SAMPLE_CSV], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "karo-beispiel-bestand.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function doImport() {
    if (!parsed?.cars.length) return;
    carStore.addMany(parsed.cars);
    nav("/haendler");
  }

  return (
    <div className="container-x py-6 sm:py-10">
      <Link to="/haendler" className="mb-5 inline-flex items-center gap-1.5 text-[14px] font-medium text-sub hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Händler-Dashboard
      </Link>

      <h1 className="text-[28px] font-semibold tracking-tight sm:text-[34px]">Bestand importieren</h1>
      <p className="mt-2 max-w-xl text-[15px] text-sub">
        Lade deine Fahrzeugliste als CSV hoch (Export aus mobile.de, AutoScout oder deiner Händler-Software) —
        wir erkennen die Spalten automatisch. Keine Tipparbeit.
      </p>

      {!parsed && (
        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {/* Upload */}
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => { e.preventDefault(); onFile(e.dataTransfer.files?.[0]); }}
            className="card flex cursor-pointer flex-col items-center justify-center gap-3 p-10 text-center transition-colors hover:border-accent/40"
          >
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent-soft text-accent">
              <Upload className="h-7 w-7" />
            </span>
            <p className="text-[16px] font-semibold">CSV-Datei hochladen</p>
            <p className="max-w-[260px] text-[13px] text-sub">Datei hierher ziehen oder klicken zum Auswählen (.csv)</p>
            <input ref={fileRef} type="file" accept=".csv,text/csv" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          </div>

          {/* Paste / Demo */}
          <div className="card flex flex-col p-5">
            <p className="mb-2 text-[14px] font-semibold">… oder CSV-Inhalt einfügen</p>
            <textarea
              value={text}
              onChange={(e) => { setText(e.target.value); setFileName(""); }}
              placeholder={"Marke;Modell;Preis;Kilometer;Kraftstoff\nVW;Golf;11900;98000;Benzin"}
              className="min-h-[120px] flex-1 resize-none rounded-xl border border-line bg-white p-3 font-mono text-[12.5px] outline-none focus:border-accent focus:ring-4 focus:ring-accent/15"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button onClick={() => setText(SAMPLE_CSV)} className="btn-ghost h-10 px-4 text-[13px]">
                <Sparkles className="h-4 w-4" /> Demo-Bestand laden
              </button>
              <button onClick={downloadSample} className="btn-ghost h-10 px-4 text-[13px]">
                <Download className="h-4 w-4" /> Beispiel-CSV
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Vorschau */}
      {parsed && (
        <div className="mt-6">
          {/* Report */}
          <div className="card mb-4 flex flex-wrap items-center gap-x-6 gap-y-3 p-4">
            <span className="inline-flex items-center gap-2 text-[15px] font-semibold text-emerald-600">
              <CheckCircle2 className="h-5 w-5" /> {parsed.report.imported} Fahrzeuge erkannt
            </span>
            {parsed.report.skipped > 0 && (
              <span className="text-[13px] text-sub">{parsed.report.skipped} übersprungen</span>
            )}
            {fileName && <span className="inline-flex items-center gap-1.5 text-[13px] text-sub"><FileSpreadsheet className="h-4 w-4" /> {fileName}</span>}
            <button onClick={() => { setText(""); setFileName(""); }} className="ml-auto text-[13px] font-medium text-accent hover:underline">
              Andere Datei
            </button>
          </div>

          {/* Warnungen */}
          {(parsed.report.warnings.length > 0 || parsed.report.unmapped.length > 0) && (
            <div className="card mb-4 border-amber-200/70 bg-amber-50/50 p-4">
              <p className="mb-1.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-amber-700">
                <AlertTriangle className="h-4 w-4" /> Hinweise
              </p>
              {parsed.report.unmapped.length > 0 && (
                <p className="text-[12.5px] text-amber-800/80">
                  Nicht zugeordnete Spalten: {parsed.report.unmapped.join(", ")}
                </p>
              )}
              <ul className="mt-1 max-h-24 overflow-y-auto text-[12.5px] text-amber-800/80">
                {parsed.report.warnings.slice(0, 6).map((w, i) => <li key={i}>• {w}</li>)}
                {parsed.report.warnings.length > 6 && <li>… und {parsed.report.warnings.length - 6} weitere</li>}
              </ul>
            </div>
          )}

          {/* Preview-Tabelle */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="border-b border-black/[0.06] bg-black/[0.02] text-[11px] uppercase tracking-wide text-sub">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">Fahrzeug</th>
                    <th className="px-3 py-2.5 font-semibold">Bj.</th>
                    <th className="px-3 py-2.5 font-semibold">km</th>
                    <th className="px-3 py-2.5 font-semibold">Kraftstoff</th>
                    <th className="px-4 py-2.5 text-right font-semibold">Preis</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.cars.slice(0, 10).map((c) => (
                    <tr key={c.id} className="border-b border-black/[0.04] last:border-0">
                      <td className="px-4 py-2.5 font-medium">{c.make} {c.model} <span className="text-sub">{c.variant ?? ""}</span></td>
                      <td className="px-3 py-2.5 text-sub">{c.year || "—"}</td>
                      <td className="px-3 py-2.5 text-sub">{c.mileage ? km(c.mileage) : "—"}</td>
                      <td className="px-3 py-2.5 text-sub">{c.fuel}</td>
                      <td className="px-4 py-2.5 text-right font-semibold">{c.price ? eur(c.price) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {parsed.cars.length > 10 && (
              <p className="px-4 py-2.5 text-[12.5px] text-sub">… und {parsed.cars.length - 10} weitere Fahrzeuge</p>
            )}
          </div>

          {/* Import-Button */}
          <div className="sticky bottom-4 mt-5 flex justify-end">
            <button onClick={doImport} disabled={!parsed.cars.length} className="btn-accent shadow-lift disabled:opacity-40">
              {parsed.cars.length} Fahrzeuge importieren <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
