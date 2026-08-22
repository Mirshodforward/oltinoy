"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { imageUrl, productImageLoader } from "@/lib/images";
import { Logo } from "@/components/ui/Logo";
import { ChevronLeft, ChevronRight } from "@/components/ui/icons";

type Img = { fileName: string; alt: string };

/**
 * Product gallery. The frame is the anchor of the whole page, so it carries
 * every way of moving between shots: arrows that fade in on hover (and stay put
 * on touch), a swipe, the arrow keys once the frame has focus, and the
 * thumbnail strip — a vertical column beside the image on desktop, a snap rail
 * underneath it on phones.
 */
export function Gallery({ images, name }: { images: Img[]; name: string }) {
  const t = useTranslations("product");
  const [active, setActive] = useState(0);
  const touchX = useRef<number | null>(null);

  // A model without photos still has to look shot: mark on a seam-ruled ground.
  if (images.length === 0) {
    return (
      <div className="relative flex aspect-[3/4] items-center justify-center overflow-hidden rounded-lg bg-cream">
        <div
          className="absolute inset-0 opacity-[0.45]"
          style={{
            backgroundImage: "repeating-linear-gradient(135deg, var(--color-sand) 0 1px, transparent 1px 14px)",
          }}
          aria-hidden="true"
        />
        <Logo height={64} className="relative opacity-45" />
      </div>
    );
  }

  const total = images.length;
  const current = images[active];
  const many = total > 1;

  /** Cyclic, so neither arrow is ever a dead end. */
  function step(delta: number) {
    setActive((a) => (a + delta + total) % total);
  }

  function onTouchStart(e: React.TouchEvent) {
    touchX.current = e.touches[0].clientX;
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
    touchX.current = null;
  }
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    step(e.key === "ArrowRight" ? 1 : -1);
  }

  // Hidden until the frame is hovered or focused; always visible where there is
  // no hover to speak of.
  const arrow =
    "absolute top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory/90 opacity-0 shadow-md backdrop-blur transition duration-300 ease-[var(--ease-expo)] hover:bg-ivory focus-visible:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100 [@media(hover:none)]:opacity-100";

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:gap-4">
      {/* Main frame */}
      <div
        className="group relative aspect-[3/4] overflow-hidden rounded-lg bg-cream lg:order-2 lg:min-w-0 lg:flex-1"
        role="group"
        aria-label={name}
        tabIndex={many ? 0 : undefined}
        onKeyDown={onKeyDown}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <Image
          key={current.fileName}
          loader={productImageLoader}
          src={imageUrl(current.fileName, "lg", "webp")}
          alt={current.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 32rem, 42vw"
          priority
          className="object-cover"
        />

        {many && (
          <>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label={t("galleryPrev")}
              className={`${arrow} left-3`}
              style={{ color: "var(--color-ink)" }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label={t("galleryNext")}
              className={`${arrow} right-3`}
              style={{ color: "var(--color-ink)" }}
            >
              <ChevronRight size={20} />
            </button>

            <p className="badge badge-sold absolute bottom-3 right-3 tabular-nums" aria-live="polite">
              {t("galleryCounter", { index: active + 1, total })}
            </p>
          </>
        )}
      </div>

      {/* Thumbnails — rail on phones, column on desktop. */}
      {many && (
        <div className="rail no-scrollbar py-0.5 lg:order-1 lg:max-h-[36rem] lg:w-[74px] lg:flex-none lg:flex-col lg:overflow-y-auto">
          {images.map((img, i) => (
            <button
              key={img.fileName}
              type="button"
              onClick={() => setActive(i)}
              aria-label={t("galleryThumb", { index: i + 1 })}
              aria-pressed={i === active}
              className={`relative aspect-[3/4] w-16 overflow-hidden rounded-md transition duration-300 ease-[var(--ease-expo)] lg:w-full ${
                i === active
                  ? "ring-2 ring-gold"
                  : "opacity-70 ring-1 ring-[var(--line)] hover:opacity-100 hover:ring-[var(--color-gold)]"
              }`}
            >
              <Image
                loader={productImageLoader}
                src={imageUrl(img.fileName, "sm", "webp")}
                alt=""
                fill
                sizes="74px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
