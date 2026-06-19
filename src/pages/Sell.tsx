import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ImagePlus, ArrowUp, Check, X, BadgeCheck } from "lucide-react";
import {
  parseListing, mergeDraft, nextStep, isComplete, progress, ackReply, autoDescription, type Draft,
} from "@/lib/ai";
import { boldParts, eur, km } from "@/lib/format";
import { carStore } from "@/data/store";
import { CarImage } from "@/components/CarImage";
import type { Car } from "@/data/types";

interface Msg { id: number; role: "ai" | "user"; text: string }

const GREETING =
  "Hi 👋 Ich helf dir, dein Auto in unter einer Minute zu inserieren.\n\nBeschreib es einfach in **einem Satz** — Marke, Baujahr, km und Preis. Du kannst auch direkt **Fotos hochladen**.";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const step = nextStep(draft);
  const complete = isComplete(draft);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const pushAI = (text: string) => setMessages((m) => [...m, { id: mid++, role: "ai", text }]);

  function respondTo(next: Draft) {
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      const ack = ackReply(next);
      const ns = nextStep(draftRef.current);
      if (ack && ns) pushAI(`${ack}\n\n${ns.prompt}`);
      else if (ack) pushAI(`${ack}\n\n✅ **Alles da!** Schau rechts in die Vorschau — du kannst direkt veröffentlichen.`);
      else if (ns) pushAI(ns.prompt);
      else pushAI("✅ **Alles da!** Du kannst dein Inserat jetzt veröffentlichen.");
    }, 480);
  }

  // immer aktuellen Draft für das Timeout verfügbar halten
  const draftRef = useRef(draft);
  draftRef.current = draft;

  function send(text: string) {
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [...m, { id: mid++, role: "user", text: value }]);
    setInput("");
    const extracted = parseListing(value);
    const next = mergeDraft(draftRef.current, extracted);
    draftRef.current = next;
    setDraft(next);
    respondTo(extracted);
  }

  function onFiles(files: FileList | null) {
    if (!files?.length) return;
    const urls = Array.from(files).slice(0, 10).map((f) => URL.createObjectURL(f));
    const all = [...photos, ...urls];
    setPhotos(all);
    setDraft((d) => ({ ...d, images: all }));
    draftRef.current = { ...draftRef.current, images: all };
    setMessages((m) => [...m, { id: mid++, role: "user", text: `📷 ${urls.length} Foto(s) hinzugefügt` }]);
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      pushAI(`Top, die Fotos sehen gut aus! ${nextStep(draftRef.current)?.prompt ?? "Du kannst jetzt veröffentlichen."}`);
    }, 480);
  }

  function publish() {
    const car: Car = {
      id: "u" + Date.now().toString(36),
      make: draft.make ?? "Fahrzeug",
      model: draft.model ?? "",
      variant: draft.variant,
      year: draft.year ?? new Date().getFullYear(),
      price: draft.price ?? 0,
      mileage: draft.mileage ?? 0,
      fuel: draft.fuel ?? "Benzin",
      gearbox: draft.gearbox ?? "Schaltgetriebe",
      power: draft.power,
      tuevUntil: draft.tuevUntil,
      accident: draft.accident ?? "unbekannt",
      city,
      color: draft.color,
      features: draft.features ?? [],
      description: draft.description?.trim() || autoDescription(draft),
      images: photos,
      seller: { name: seller.trim() || "Privatanbieter", type: sellerType, verified: sellerType === "Händler" },
      createdAt: Date.now(),
    };
    carStore.add(car);
    nav(`/auto/${car.id}`);
  }

  return (
    <div className="container-x grid gap-6 py-6 lg:grid-cols-[1fr_400px] lg:py-8">
      {/* Chat */}
      <div className="flex h-[calc(100vh-7rem)] flex-col overflow-hidden rounded-3xl bg-white shadow-soft border border-black/[0.06]">
        <div className="flex items-center gap-2.5 border-b border-black/[0.06] px-5 py-3.5">
          <span className="grid h-8 w-8 place-items-center rounded-full bg-accent text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="text-[14px] font-semibold leading-tight">Karo Assistent</p>
            <p className="text-[12px] text-sub">Inserat erstellen · {progress(draft)}% fertig</p>
          </div>
          <div className="ml-auto h-1.5 w-24 overflow-hidden rounded-full bg-black/[0.06]">
            <motion.div className="h-full rounded-full bg-accent" animate={{ width: `${progress(draft)}%` }} />
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-5 sm:px-5">
          {messages.map((m) => (
            <Bubble key={m.id} msg={m} />
          ))}
          {typing && (
            <div className="flex gap-1.5 px-1">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-2 w-2 rounded-full bg-sub/50"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </div>
          )}

          {/* Quick replies */}
          {!typing && step && QUICK[step.field as string] && (
            <div className="flex flex-wrap gap-2 px-1 pt-1">
              {QUICK[step.field as string].map((opt) => (
                <button key={opt} onClick={() => send(opt)} className="btn-pill">
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Composer */}
        <div className="border-t border-black/[0.06] p-3">
          <div className="flex items-end gap-2 rounded-2xl border border-line bg-white p-2 focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15">
            <button
              onClick={() => fileRef.current?.click()}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-sub hover:bg-black/[0.04]"
              title="Fotos hinzufügen"
            >
              <ImagePlus className="h-5 w-5" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder={step ? "Antwort eingeben …" : "Noch ein Detail? (z. B. Ausstattung)"}
              className="max-h-32 flex-1 resize-none bg-transparent py-2.5 text-[15px] outline-none placeholder:text-sub/70"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim()}
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent text-white transition-all hover:bg-accent-hover disabled:opacity-30"
            >
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
          {photos.length > 0 && (
            <div className="mt-2 flex gap-2 overflow-x-auto px-1">
              {photos.map((p, i) => (
                <div key={i} className="relative shrink-0">
                  <CarImage src={p} alt="" className="h-12 w-16 rounded-lg" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Live-Vorschau */}
      <div className="lg:sticky lg:top-20 lg:self-start">
        <p className="mb-2 px-1 text-[12px] font-medium uppercase tracking-wide text-sub">Live-Vorschau</p>
        <div className="overflow-hidden rounded-3xl bg-white shadow-soft border border-black/[0.06]">
          <CarImage src={photos[0]} alt="Vorschau" className="aspect-[4/3] w-full" />
          <div className="p-4">
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-[16px] font-semibold">
                {draft.make ? `${draft.make} ${draft.model ?? ""}` : "Dein Auto"}
              </h3>
              <span className="text-[16px] font-semibold">{draft.price ? eur(draft.price) : "— €"}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[12.5px] text-sub">
              <span>{draft.year ?? "Baujahr ?"}</span>
              <span>· {draft.mileage ? km(draft.mileage) : "km ?"}</span>
              <span>· {draft.fuel ?? "Kraftstoff ?"}</span>
              <span>· {draft.gearbox ?? "Getriebe ?"}</span>
            </div>
            {draft.features && draft.features.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                {draft.features.slice(0, 5).map((f) => (
                  <span key={f} className="chip py-0.5 text-[11.5px]">{f}</span>
                ))}
              </div>
            )}

            {/* Veröffentlichen-Bereich */}
            <AnimatePresence>
              {complete && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 space-y-2.5 overflow-hidden border-t border-black/[0.06] pt-4"
                >
                  <div className="flex items-center gap-1.5 text-[13px] font-medium text-emerald-600">
                    <Check className="h-4 w-4" /> Bereit zum Veröffentlichen
                  </div>
                  <input value={seller} onChange={(e) => setSeller(e.target.value)} placeholder="Verkäufername" className="input h-10 text-[14px]" />
                  <div className="flex gap-2">
                    <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Stadt" className="input h-10 flex-1 text-[14px]" />
                    <div className="flex rounded-xl bg-black/[0.04] p-1">
                      {(["Händler", "Privat"] as const).map((t) => (
                        <button
                          key={t}
                          onClick={() => setSellerType(t)}
                          className={`rounded-lg px-3 text-[13px] font-medium ${sellerType === t ? "bg-white shadow-soft" : "text-sub"}`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <button onClick={publish} className="btn-accent h-12 w-full">
                    Inserat veröffentlichen
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-sub">
          <BadgeCheck className="h-3.5 w-3.5 text-accent" /> Kostenlos · keine Provision · Wuppertal & NRW
        </div>
      </div>
    </div>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const isAI = msg.role === "ai";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isAI ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2.5 text-[14.5px] leading-relaxed ${
          isAI ? "bg-black/[0.04] text-ink" : "bg-accent text-white"
        }`}
      >
        {boldParts(msg.text).map((p, i) =>
          p.b ? <strong key={i} className="font-semibold">{p.t}</strong> : <span key={i}>{p.t}</span>
        )}
      </div>
    </motion.div>
  );
}
