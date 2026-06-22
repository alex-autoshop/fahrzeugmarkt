import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CHATS = [
  { id: 1, name: "Salem Automobile", car: "Nissan Micra C+C", last: "Klar, Probefahrt geht morgen 👍", time: "14:32", unread: 2, avatar: "S" },
  { id: 2, name: "Auto Çelik", car: "VW Golf VII", last: "Der Preis ist noch verhandelbar.", time: "Gestern", unread: 0, avatar: "A" },
  { id: 3, name: "Michael R.", car: "BMW 320d Touring", last: "Hat das Auto eine AHK?", time: "Mo", unread: 0, avatar: "M" },
];

export default function Messages() {
  const nav = useNavigate();
  return (
    <div className="animate-fade-up">
      <div className="mb-4 flex items-center gap-2">
        <button onClick={() => nav(-1)} className="icon-btn -ml-2"><ChevronLeft className="h-6 w-6" /></button>
        <h1 className="text-[22px] font-bold">Nachrichten</h1>
      </div>

      <div className="space-y-1">
        {CHATS.map((c) => (
          <button key={c.id} className="flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-colors hover:bg-white/[0.04]">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-raised to-surface text-[16px] font-bold text-gold">
              {c.avatar}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="truncate text-[15px] font-semibold">{c.name}</p>
                <span className="shrink-0 text-[11.5px] text-faint">{c.time}</span>
              </div>
              <p className="truncate text-[12px] text-gold/80">{c.car}</p>
              <p className={`truncate text-[13px] ${c.unread ? "font-medium text-ink" : "text-sub"}`}>{c.last}</p>
            </div>
            {c.unread > 0 && (
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-gold text-[11px] font-bold text-black">{c.unread}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
