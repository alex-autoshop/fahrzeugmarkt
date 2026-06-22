import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ImagePlus, ArrowUp, Check } from "lucide-react";
import {
  parseListing, mergeDraft, nextStep, isComplete, progress, ackReply, autoDescription, type Draft,
} from "@/lib/ai";
import { boldParts, eur, km } from "@/lib/format";
import { carStore } from "@/data/store";
import type { Car } from "@/data/types";

interface Msg { id: number; role: "ai" | "user"; text: string }

const GREETING =
  "Hi 👋 Ich helf dir, dein Auto in unter einer Minute zu inserieren.\n\nBeschreib es in **einem Satz** — Marke, Baujahr, km und Preis. Oder lad direkt **Fotos** hoch.";

const QUICK: Record<string, string[]> = {
  fuel: ["Benzin", "Diesel", "Elektro", "Hybrid"],
  gearbox: ["Schaltgetriebe", "Automatik"],
  accident: ["Unfallfrei", "Hatte einen Unfall"],
};

let mid = 1;

export default function Sell() {
  const nav = useNavigate();
  const [messages, setMessages] = useState<Msg[]>([{ id: 0, role: "ai", text: GREETING }]);
  const [draft, setDraft] = useState<Draft>({});
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const [seller, setSeller] = useState("Salem Automobile");
  const [city, setCity] = useState("Wuppertal");
  const [sellerType, setSellerType] = useState<"Händler" | "Privat">("Händler");
  const endRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const draftRef = useRef(draft);
  draftRef.current = draft;

  const step = nextStep(draft);
  const complete = isComplete(draft);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing, complete]);

  const pushAI = (text: string) => setMessages((m) => [...m, { id: mid++, role: "ai", text }]);

  function respond(extracted: Draft) {
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      const ack = ackReply(extracted);
      const ns = nextStep(draftRef.current);
      if (ack && ns) pushAI(`${ack}\n\n${ns.prompt}`);
      else if (ack) pushAI(`${ack}\n\n✅ **Alles da!** Unten kannst du veröffentlichen.`);
      else if (ns) pushAI(ns.prompt);
      else pushAI("✅ **Alles da!** Du kannst jetzt veröffentlichen.");
    }, 450);
  }

  function send(text: string) {
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [...m, { id: mid++, role: "user", text: value }]);
    setInput("");
    const extracted = parseListing(value);
    const next = mergeDraft(draftRef.current, extracted);
    draftRef.current = next;
    setDraft(next);
    respond(extracted);
  }

  function onFiles(files: FileList | null) {
    if (!files?.length) return;
    const urls = Array.from(files).slice(0, 10).map((f) => URL.createObjectURL(f));
    const all = [...photos, ...urls];
    setPhotos(all);
    const next = { ...draftRef.current, images: all };
    draftRef.current = next;
    setDraft(next);
    setMessages((m) => [...m, { id: mid++, role: "user", text: `📷 ${urls.length} Foto(s) hinzugefügt` }]);
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      pushAI(`Top, die Fotos sehen gut aus! ${nextStep(draftRef.current)?.prompt ?? "Du kannst jetzt veröffentlichen."}`);
    }, 450);
  }

  function publish() {
    const car: Car = {
      id: "u" + Date.now().toString(36),
      make: draft.make ?? "Fahrzeug", model: draft.model ?? "", variant: draft.variant,
      year: draft.year ?? new Date().getFullYear(), price: draft.price ?? 0, mileage: draft.mileage ?? 0,
      fuel: draft.fuel ?? "Benzin", gearbox: draft.gearbox ?? "Schaltgetriebe", power: draft.power,
      tuevUntil: draft.tuevUntil, accident: draft.accident ?? "unbekannt", city, color: draft.color,
      features: draft.features ?? [], description: draft.description?.trim() || autoDescription(draft),
      images: photos, seller: { name: seller.trim() || "Privatanbieter", type: sellerType, verified: sellerType === "Händler" },
      createdAt: Date.now(),
    };
    carStore.add(car);
    nav(`/auto/${car.id}`);
  }

  return (
    <div className="animate-fade-up -mt-3 flex min-h-[calc(100vh-3.5rem)] flex-col">
      {/* Mini-Vorschau / Fortschritt */}
      <div className="sticky top-14 z-20 -mx-4 border-b border-hair bg-bg/90 px-4 py-2.5 backdrop-blur-xl">
        <div className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-gold-soft text-gold"><Sparkles className="h-4 w-4" /></span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13.5px] font-semibold">
              {draft.make ? `${draft.make} ${draft.model ?? ""}` : "Neues Inserat"}
              {draft.price ? <span className="text-gold"> · {eur(draft.price)}</span> : ""}
            </p>
            <p className="truncate text-[11.5px] text-faint">
              {[draft.year, draft.mileage && km(draft.mileage), draft.fuel, draft.gearbox].filter(Boolean).join(" · ") || "KI-Assistent"}
            </p>
          </div>
          <span className="text-[12px] font-bold text-gold">{progress(draft)}%</span>
        </div>
        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.08]">
          <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${progress(draft)}%` }} />
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 space-y-3 py-4">
        {messages.map((m) => <Bubble key={m.id} msg={m} />)}
        {typing && (
          <div className="flex gap-1.5 px-1">
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-2 w-2 animate-pulse rounded-full bg-sub/60" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        )}
        {!typing && step && QUICK[step.field as string] && (
          <div className="flex flex-wrap gap-2 px-1">
            {QUICK[step.field as string].map((opt) => (
              <button key={opt} onClick={() => send(opt)} className="btn-outline h-9 px-3.5 text-[13px]">{opt}</button>
            ))}
          </div>
        )}

        {/* Veröffentlichen */}
        {complete && (
          <div className="surface mt-2 space-y-2.5 p-4 animate-fade-up">
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-emerald-400"><Check className="h-4 w-4" /> Bereit zum Veröffentlichen</p>
            <input value={seller} onChange={(e) => setSeller(e.target.value)} placeholder="Verkäufername" className="field h-11 text-[14px]" />
            <div className="flex gap-2">
              <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Stadt" className="field h-11 flex-1 text-[14px]" />
              <div className="flex rounded-xl bg-white/[0.06] p-1">
                {(["Händler", "Privat"] as const).map((t) => (
                  <button key={t} onClick={() => setSellerType(t)} className={`rounded-lg px-3 text-[13px] font-medium ${sellerType === t ? "bg-gold text-black" : "text-sub"}`}>{t}</button>
                ))}
              </div>
            </div>
            <button onClick={publish} className="btn-gold h-12 w-full">Inserat veröffentlichen</button>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Composer */}
      <div className="sticky bottom-[60px] -mx-4 border-t border-hair bg-bg/95 px-4 py-2.5 backdrop-blur-xl">
        {photos.length > 0 && (
          <div className="mb-2 flex gap-2 overflow-x-auto">
            {photos.map((p, i) => <img key={i} src={p} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />)}
          </div>
        )}
        <div className="flex items-end gap-2 rounded-2xl border border-hair bg-raised p-1.5 focus-within:border-gold/60">
          <button onClick={() => fileRef.current?.click()} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sub hover:bg-white/[0.06]" aria-label="Fotos">
            <ImagePlus className="h-5 w-5" />
          </button>
          <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            rows={1}
            placeholder={step ? "Antwort eingeben …" : "Noch ein Detail?"}
            className="max-h-28 flex-1 resize-none bg-transparent py-2 text-[15px] text-ink outline-none placeholder:text-faint"
          />
          <button onClick={() => send(input)} disabled={!input.trim()} className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold text-black transition-all disabled:opacity-30">
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const isAI = msg.role === "ai";
  return (
    <div className={`flex ${isAI ? "justify-start" : "justify-end"}`}>
      <div className={`max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2.5 text-[14.5px] leading-relaxed ${isAI ? "bg-surface text-ink" : "bg-gold text-black"}`}>
        {boldParts(msg.text).map((p, i) => p.b ? <strong key={i} className="font-bold">{p.t}</strong> : <span key={i}>{p.t}</span>)}
      </div>
    </div>
  );
}
