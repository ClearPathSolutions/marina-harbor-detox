"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { facilityPhotos } from "@/lib/site";
import { Close } from "./Icons";

export default function FacilityGallery() {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const move = useCallback(
    (dir: number) =>
      setActive((i) => (i === null ? i : (i + dir + facilityPhotos.length) % facilityPhotos.length)),
    []
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [active, close, move]);

  return (
    <>
      {/* Masonry-ish responsive grid; first tile spans larger on desktop */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {facilityPhotos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            onClick={() => setActive(i)}
            className={`group relative overflow-hidden rounded-2xl bg-navy-100 shadow-soft focus-visible:ring-2 focus-visible:ring-gold-400 ${
              i === 0 ? "col-span-2 row-span-2 md:col-span-2 md:row-span-2" : ""
            }`}
            aria-label={`View photo: ${photo.alt}`}
          >
            <div className={`relative ${i === 0 ? "aspect-square md:aspect-[4/3.4]" : "aspect-square md:aspect-[4/3]"}`}>
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-navy-950/0 transition-colors duration-300 group-hover:bg-navy-950/20" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {active !== null && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-navy-950/90 p-4 backdrop-blur-sm animate-fade-in"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <Close className="h-6 w-6" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              move(-1);
            }}
            aria-label="Previous photo"
            className="absolute left-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 sm:left-6"
          >
            ‹
          </button>

          <figure className="relative max-h-[85vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={facilityPhotos[active].src}
              alt={facilityPhotos[active].alt}
              width={2560}
              height={1707}
              className="h-auto max-h-[85vh] w-full rounded-xl object-contain"
              priority
            />
            <figcaption className="mt-3 text-center text-sm text-white/80">
              {facilityPhotos[active].alt}
            </figcaption>
          </figure>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              move(1);
            }}
            aria-label="Next photo"
            className="absolute right-3 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl text-white hover:bg-white/20 sm:right-6"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
