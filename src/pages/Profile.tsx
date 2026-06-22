import { Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft, ChevronRight, Tag, Heart, Star, MessageSquareText,
  Settings, ShieldCheck, LogIn, HelpCircle,
} from "lucide-react";

const MENU = [
  { icon: Tag, label: "Meine Inserate", to: "/verkaufen", badge: "2" },
  { icon: Heart, label: "Merkliste", to: "/merkliste" },
  { icon: Star, label: "Meine Suchen", to: "/meine-suchen" },
  { icon: MessageSquareText, label: "Nachrichten", to: "/nachrichten" },
  { icon: Settings, label: "Einstellungen", to: "/profil" },
  { icon: HelpCircle, label: "Hilfe & Kontakt", to: "/profil" },
];

export default function Profile() {
  const nav = useNavigate();
  return (
    <div className="animate-fade-up">
      <div className="mb-4 flex items-center gap-2">
        <button onClick={() => nav(-1)} className="icon-btn -ml-2"><ChevronLeft className="h-6 w-6" /></button>
        <h1 className="text-[22px] font-bold">Profil</h1>
      </div>

      {/* Profilkarte */}
      <div className="surface mb-5 flex items-center gap-4 p-4">
        <span className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold to-gold-deep text-[24px] font-extrabold text-black">
          S
        </span>
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[17px] font-bold">
            Salem Automobile <ShieldCheck className="h-4.5 w-4.5 text-gold" />
          </p>
          <p className="text-[13px] text-sub">Händler · Wuppertal</p>
          <p className="mt-1 text-[12px] text-faint">Mitglied seit 2026 · 2 aktive Inserate</p>
        </div>
      </div>

      {/* Menü */}
      <div className="surface mb-5 divide-y divide-hair overflow-hidden">
        {MENU.map((m) => (
          <Link key={m.label} to={m.to} className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-white/[0.03]">
            <m.icon className="h-5 w-5 text-sub" />
            <span className="flex-1 text-[15px]">{m.label}</span>
            {m.badge && <span className="rounded-full bg-gold px-2 py-0.5 text-[11px] font-bold text-black">{m.badge}</span>}
            <ChevronRight className="h-5 w-5 text-faint" />
          </Link>
        ))}
      </div>

      <button className="btn-outline w-full">
        <LogIn className="h-4.5 w-4.5" /> Abmelden
      </button>
      <p className="mt-4 text-center text-[11.5px] text-faint">Karo · Fahrzeugmarkt für Wuppertal & NRW</p>
    </div>
  );
}
