import { useEffect, useRef, useState } from "react";
import { Globe, Check } from "lucide-react";

// Sichtbare Sprachauswahl (Google übersetzt darüber hinaus jede weitere Sprache).
const LANGS: { code: string; label: string; flag: string }[] = [
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "pl", label: "Polski", flag: "🇵🇱" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "uk", label: "Українська", flag: "🇺🇦" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
  { code: "ro", label: "Română", flag: "🇷🇴" },
  { code: "sq", label: "Shqip", flag: "🇦🇱" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "el", label: "Ελληνικά", flag: "🇬🇷" },
  { code: "zh-CN", label: "中文", flag: "🇨🇳" },
];

function getCookie(name: string): string | undefined {
  return document.cookie.split("; ").find((r) => r.startsWith(name + "="))?.split("=").slice(1).join("=");
}

function currentLang(): string {
  const raw = getCookie("googtrans");
  if (!raw) return "de";
  const parts = decodeURIComponent(raw).split("/");
  return parts[2] || "de";
}

function setLang(code: string) {
  const host = location.hostname;
  const expire = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = `googtrans=;${expire};path=/`;
  document.cookie = `googtrans=;${expire};path=/;domain=.${host}`;
  if (code !== "de") {
    document.cookie = `googtrans=/de/${code};path=/`;
    document.cookie = `googtrans=/de/${code};path=/;domain=.${host}`;
  }
  location.reload();
}

export function LanguageSwitcher() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = currentLang();
  const activeLang = LANGS.find((l) => l.code === active) ?? LANGS[0];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative notranslate" translate="no">
      <button
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 items-center gap-1.5 rounded-full px-2.5 text-[14px] font-medium text-sub transition-colors hover:bg-black/[0.04] hover:text-ink"
        aria-label="Sprache wählen"
      >
        <Globe className="h-5 w-5" />
        <span className="hidden sm:inline">{activeLang.flag}</span>
        <span className="text-[11px] font-bold uppercase">{active === "zh-CN" ? "ZH" : active}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 max-h-[60vh] w-52 overflow-y-auto rounded-2xl border border-black/[0.08] bg-white py-1.5 text-ink shadow-lift animate-scale-in">
          <p className="px-3 pb-1 pt-1 text-[10px] font-bold uppercase tracking-wide text-sub">
            Sprache / Language
          </p>
          {LANGS.map((l) => (
            <button
              key={l.code}
              onClick={() => setLang(l.code)}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-[14px] hover:bg-black/[0.04]"
            >
              <span className="text-base">{l.flag}</span>
              <span className="flex-1">{l.label}</span>
              {active === l.code && <Check className="h-4 w-4 text-accent" />}
            </button>
          ))}
          <p className="px-3 pb-1 pt-1.5 text-[10px] text-sub">Übersetzt von Google</p>
        </div>
      )}
    </div>
  );
}
