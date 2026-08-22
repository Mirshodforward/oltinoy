import Image from "next/image";

/**
 * Official brand mark (public/oltinoy_logo.png) — transparent RGBA, the gold
 * "OC" monogram with the rose silhouette. Width follows the source aspect
 * ratio (827/812) so it stays sharp at any size via next/image.
 */
export function Logo({
  className = "",
  height = 44,
  priority = false,
}: {
  className?: string;
  height?: number;
  priority?: boolean;
}) {
  const width = Math.round(height * (827 / 812));
  return (
    <Image
      src="/oltinoy_logo.png"
      alt="Oltinoy Collection"
      width={width}
      height={height}
      className={className}
      style={{ height, width: "auto" }}
      priority={priority}
    />
  );
}

/**
 * Mark + wordmark lockup. The monogram alone reads as an ornament at header
 * sizes, so everywhere the brand needs to be *named* we set it beside the mark:
 * OLTINOY in the display face, COLLECTION tracked out beneath it.
 */
export function LogoLockup({
  height = 40,
  priority = false,
  className = "",
}: {
  height?: number;
  priority?: boolean;
  className?: string;
}) {
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <Logo height={height} priority={priority} />
      <span className="flex flex-col leading-none">
        <span
          className="font-[family-name:var(--font-display)] font-semibold tracking-[-0.02em]"
          style={{ fontSize: height * 0.44, color: "var(--fg)" }}
        >
          Oltinoy
        </span>
        <span
          className="mt-[0.28em] font-[family-name:var(--font-body)] font-bold uppercase"
          style={{
            fontSize: height * 0.2,
            letterSpacing: "0.34em",
            color: "var(--accent-text)",
          }}
        >
          Collection
        </span>
      </span>
    </span>
  );
}
