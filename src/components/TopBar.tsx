import { Link, useNavigate } from "react-router-dom";
import { CircleUser, MessageSquareText, Bell } from "lucide-react";
import { Logo } from "./Logo";

export function TopBar() {
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-40 border-b border-hair bg-bg/80 backdrop-blur-xl">
      <div className="app-x flex h-14 items-center justify-between">
        <button onClick={() => nav("/profil")} className="icon-btn" aria-label="Profil">
          <CircleUser className="h-6 w-6" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-gold" />
        </button>

        <Link to="/" aria-label="Startseite">
          <Logo />
        </Link>

        <div className="flex items-center">
          <button onClick={() => nav("/nachrichten")} className="icon-btn" aria-label="Nachrichten">
            <MessageSquareText className="h-[22px] w-[22px]" />
          </button>
          <button onClick={() => nav("/benachrichtigungen")} className="icon-btn" aria-label="Benachrichtigungen">
            <Bell className="h-[22px] w-[22px]" />
            <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[10px] font-bold text-black">3</span>
          </button>
        </div>
      </div>
    </header>
  );
}
