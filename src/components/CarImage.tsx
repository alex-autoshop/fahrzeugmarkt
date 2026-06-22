import { useState } from "react";

// Bild mit weichem Gradient-Fallback, falls die URL nicht lädt — sieht nie kaputt aus.
export function CarImage({
  src,
  alt,
  className = "",
}: {
  src?: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImg = src && !failed;
  return (
    <div className={`relative overflow-hidden bg-gradient-to-br from-[#23232a] to-[#15151a] ${className}`}>
      {showImg ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <svg viewBox="0 0 64 32" className="w-1/3 opacity-25" fill="currentColor">
            <path d="M6 22c0-1 1-2 2-2h2l3-7c.5-1.2 1.7-2 3-2h20c1.3 0 2.5.8 3 2l3 7h2c1 0 2 1 2 2v4h-6a4 4 0 11-8 0H20a4 4 0 11-8 0H6v-4zm10-2h32l-2.2-5.2c-.2-.5-.7-.8-1.2-.8H19.4c-.5 0-1 .3-1.2.8L16 20z" />
          </svg>
        </div>
      )}
    </div>
  );
}
