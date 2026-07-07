import Image from "next/image";

/**
 * Official brand mark (public/oltinoy_logo.png) — transparent PNG, gold + rose
 * "OC" monogram. Renders at a fixed height; width follows the source aspect
 * ratio (~1.02:1) so it stays sharp at any size via next/image.
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
