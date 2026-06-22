import { ChevronLeft, TrendingDown, Sparkles, MessageSquareText, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NOTES = [
  { id: 1, icon: TrendingDown, color: "text-emerald-400", title: "Preis gesenkt", text: "VW Golf VII jetzt 11.900 € (−600 €) — passt zu deiner Suche.", time: "vor 1 Std", unread: true },
  { id: 2, icon: Sparkles, color: "text-gold", title: "Neuer Treffer", text: "3 neue Elektro-Fahrzeuge bis 35.000 € in NRW.", time: "vor 3 Std", unread: true },
  { id: 3, icon: MessageSquareText, color: "text-gold", title: "Neue Nachricht", text: "Salem Automobile hat dir geantwortet.", time: "vor 5 Std", unread: true },
  { id: 4, icon: ShieldCheck, color: "text-emerald-400", title: "Inserat verifiziert", text: "Dein Profil wurde als Händler bestätigt.", time: "Gestern", unread: false },
];

export default function Notifications() {
  const nav = useNavigate();
  return (
    <div className="animate-fade-up">
      <div className="mb-4 flex items-center gap-2">
        <button onClick={() => nav(-1)} className="icon-btn -ml-2"><ChevronLeft className="h-6 w-6" /></button>
        <h1 className="text-[22px] font-bold">Benachrichtigungen</h1>
      </div>

      <div className="space-y-2">
        {NOTES.map((n) => (
          <div key={n.id} className={`surface flex items-start gap-3 p-3.5 ${n.unread ? "" : "opacity-70"}`}>
            <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/[0.06] ${n.color}`}>
              <n.icon className="h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-[14px] font-semibold">{n.title}</p>
                {n.unread && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
              </div>
              <p className="text-[13px] text-sub">{n.text}</p>
              <p className="mt-0.5 text-[11.5px] text-faint">{n.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
