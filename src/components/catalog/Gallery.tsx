"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { imageUrl, productImageLoader } from "@/lib/images";
import { Logo } from "@/components/ui/Logo";

type Img = { fileName: string; alt: string };

/** Lightweight product gallery: main image + thumbnails, swipe on mobile. */
export function Gallery({ images, name }: { images: Img[]; name: string }) {
  const [active, setActive] = useState(0);
  const touchX = useRef<number | null>(null);

  if (images.length === 0) {
    return (
      <div className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)]" style={{ background: "var(--color-ivory-deep)" }}>
        <div className="absolute inset-0 flex items-center justify-center opacity-60">
          <Logo height={64} />
        </div>
      </div>
    );
  }

  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0) setActive((a) => Math.min(a + 1, images.length - 1));
      else setActive((a) => Math.max(a - 1, 0));
    }
    touchX.current = null;
  }

  const current = images[active];

  return (
    <div>
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-ivory-deep)]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          key={current.fileName}
          loader={productImageLoader}
          src={imageUrl(current.fileName, "lg", "webp")}
          alt={current.alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          className="object-cover"
        />
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === active ? 18 : 6,
                  background: i === active ? "var(--color-gold)" : "rgba(247,243,236,0.7)",
                }}
                aria-hidden="true"
              />
            ))}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={img.fileName}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`${name} — ${i + 1}`}
              aria-current={i === active}
              className="relative h-20 w-16 shrink-0 overflow-hidden rounded-md border-2 transition-colors"
              style={{ borderColor: i === active ? "var(--color-gold)" : "transparent" }}
            >
              <Image
                loader={productImageLoader}
                src={imageUrl(img.fileName, "sm", "webp")}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
