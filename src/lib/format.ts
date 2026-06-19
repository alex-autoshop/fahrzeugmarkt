export const eur = (n: number) =>
  n.toLocaleString("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export const km = (n: number) => n.toLocaleString("de-DE") + " km";

export function ago(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 3600) return `vor ${Math.max(1, Math.floor(s / 60))} Min`;
  if (s < 86400) return `vor ${Math.floor(s / 3600)} Std`;
  return `vor ${Math.floor(s / 86400)} Tg`;
}

/** Mini-Markdown: **fett** -> <strong>. Sicher (kein HTML aus Input). */
export function boldParts(text: string): Array<{ b: boolean; t: string }> {
  return text.split(/(\*\*[^*]+\*\*)/g).filter(Boolean).map((seg) =>
    seg.startsWith("**") && seg.endsWith("**")
      ? { b: true, t: seg.slice(2, -2) }
      : { b: false, t: seg }
  );
}
