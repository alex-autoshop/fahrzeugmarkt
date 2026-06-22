// Alex-Autoshop-Logo zusammen mit "Fahrzeugmarkt" als gemeinsames Brand-Lockup.
export function Logo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const h = size === "lg" ? "h-9" : size === "sm" ? "h-6" : "h-7";
  const text =
    size === "lg" ? "text-[15px]" : size === "sm" ? "text-[10px]" : "text-[11px]";
  return (
    <div className="flex items-center gap-2.5 select-none">
      <img
        src={`${import.meta.env.BASE_URL}images/logo-cropped.png`}
        alt="Alex Autoshop"
        className={`${h} w-auto`}
      />
      <span className="h-5 w-px bg-white/15" />
      <span className={`${text} font-extrabold uppercase tracking-[0.18em] text-gold leading-none`}>
        Fahrzeug<span className="text-ink">markt</span>
      </span>
    </div>
  );
}
