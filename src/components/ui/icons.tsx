import type { SVGProps } from "react";

/**
 * One hand-drawn icon family for the whole product — replaces the emoji that
 * used to stand in for icons. Every glyph shares the same grid (24), stroke
 * (1.5, round caps/joins) and inherits `currentColor`, so an icon always picks
 * up the colour of the text it sits next to.
 *
 * Decorative by default (`aria-hidden`). Pass a `title` when an icon carries
 * meaning on its own — it then renders as an accessible `img` role.
 */
export type IconProps = Omit<SVGProps<SVGSVGElement>, "children"> & {
  /** Square size in px. Default 20 — matches the body cap-height. */
  size?: number;
  /** Accessible name. Omit for decorative icons sitting beside a text label. */
  title?: string;
};

function Svg({ size = 20, title, children, ...rest }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

/* ── Direction ─────────────────────────────────────────────────────────── */

export const ArrowRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 12h15M13.5 6l6 6-6 6" />
  </Svg>
);

export const ArrowLeft = (p: IconProps) => (
  <Svg {...p}>
    <path d="M19.5 12h-15M10.5 6l-6 6 6 6" />
  </Svg>
);

export const ArrowUpRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7.5 16.5 16.5 7.5M9 7.5h7.5V15" />
  </Svg>
);

export const ChevronDown = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 9.5 6 6 6-6" />
  </Svg>
);

export const ChevronLeft = (p: IconProps) => (
  <Svg {...p}>
    <path d="m14.5 18-6-6 6-6" />
  </Svg>
);

export const ChevronRight = (p: IconProps) => (
  <Svg {...p}>
    <path d="m9.5 18 6-6-6-6" />
  </Svg>
);

/* ── Chrome ────────────────────────────────────────────────────────────── */

export const Menu = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 7h17M3.5 12h12M3.5 17h17" />
  </Svg>
);

export const Close = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Svg>
);

export const Search = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="6.75" />
    <path d="m20 20-4.2-4.2" />
  </Svg>
);

export const Sliders = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 7h4M11.5 7h9M3.5 12h9M16.5 12h4M3.5 17h4M11.5 17h9" />
    <circle cx="9.5" cy="7" r="2" />
    <circle cx="14.5" cy="12" r="2" />
    <circle cx="9.5" cy="17" r="2" />
  </Svg>
);

export const Check = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Svg>
);

export const Plus = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const Minus = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
);

export const ExternalLink = (p: IconProps) => (
  <Svg {...p}>
    <path d="M14 4h6v6M20 4l-8.5 8.5" />
    <path d="M18 14v4.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 4 18.5v-11A1.5 1.5 0 0 1 5.5 6H10" />
  </Svg>
);

/* ── Contact ───────────────────────────────────────────────────────────── */

/** Telegram — the one solid glyph; the brand mark reads wrong as an outline. */
export const Telegram = ({ size = 20, title, ...rest }: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    role={title ? "img" : undefined}
    aria-hidden={title ? undefined : true}
    focusable="false"
    {...rest}
  >
    {title ? <title>{title}</title> : null}
    <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
  </svg>
);

export const Phone = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8.4 4.5H5.6A1.6 1.6 0 0 0 4 6.2c0 7.6 6.2 13.8 13.8 13.8a1.6 1.6 0 0 0 1.7-1.6v-2.8l-3.9-1.3-1.7 2a13.9 13.9 0 0 1-4.3-4.3l2-1.7z" />
  </Svg>
);

export const MapPin = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21.2s7-5.8 7-11.2a7 7 0 1 0-14 0c0 5.4 7 11.2 7 11.2z" />
    <circle cx="12" cy="10" r="2.6" />
  </Svg>
);

export const Clock = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7v5.2l3.4 2" />
  </Svg>
);

export const Instagram = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.8" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
  </Svg>
);

export const Mail = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2" />
    <path d="m3.6 7 8.4 5.6L20.4 7" />
  </Svg>
);

export const MapIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9 4.5 3.5 7v12.5L9 17m0-12.5 6 2.5m-6-2.5V17m6-10 5.5-2.5V17L15 19.5m0-12.5V19.5M9 17l6 2.5" />
  </Svg>
);

/* ── Value propositions ────────────────────────────────────────────────── */

/** Own sewing workshop. */
export const Scissors = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="6" cy="6.2" r="2.4" />
    <circle cx="6" cy="17.8" r="2.4" />
    <path d="M8.1 7.5 20 19.6M8.1 16.5 20 4.4" />
  </Svg>
);

/** New models every week. */
export const Repeat = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.6 12a8.4 8.4 0 0 1 14.5-5.8M20.4 12a8.4 8.4 0 0 1-14.5 5.8" />
    <path d="M20.5 4v5.5H15M3.5 20v-5.5H9" />
  </Svg>
);

/** Wholesale volume. */
export const Package = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.5 8.2 12 3.6l8.5 4.6v7.6L12 20.4l-8.5-4.6z" />
    <path d="M3.5 8.2 12 12.8l8.5-4.6M12 12.8v7.6M7.6 5.9l8.6 4.6" />
  </Svg>
);

/** Physical store. */
export const Storefront = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.3 10.5V19a1.2 1.2 0 0 0 1.2 1.2h13a1.2 1.2 0 0 0 1.2-1.2v-8.5" />
    <path d="M3 10.5h18l-1.4-5.2a1.2 1.2 0 0 0-1.2-.9H5.6a1.2 1.2 0 0 0-1.2.9z" />
    <path d="M9.5 20.2v-5.4h5v5.4" />
  </Svg>
);

export const ShieldCheck = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.2 4.8 6v5.4c0 4.5 3 7.9 7.2 9.4 4.2-1.5 7.2-4.9 7.2-9.4V6z" />
    <path d="m9.2 11.8 2.2 2.2 4.1-4.4" />
  </Svg>
);

export const Truck = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 6.5h10.5v9.8H3zM13.5 10h3.6l3 3.2v3.1h-6.6z" />
    <circle cx="7.1" cy="17.8" r="1.8" />
    <circle cx="16.9" cy="17.8" r="1.8" />
  </Svg>
);

export const Ruler = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.4 15.4 15.4 4.4a1.6 1.6 0 0 1 2.2 0l2 2a1.6 1.6 0 0 1 0 2.2l-11 11a1.6 1.6 0 0 1-2.2 0l-2-2a1.6 1.6 0 0 1 0-2.2z" />
    <path d="m8 11.9 1.8 1.8M11 8.9l1.8 1.8M14 5.9l1.8 1.8" />
  </Svg>
);

export const Sparkle = (p: IconProps) => (
  <Svg {...p}>
    <path d="M11 3.5 12.6 8.4 17.5 10 12.6 11.6 11 16.5 9.4 11.6 4.5 10 9.4 8.4z" />
    <path d="M18 15.5l.7 2.3 2.3.7-2.3.7-.7 2.3-.7-2.3-2.3-.7 2.3-.7z" />
  </Svg>
);

/** "Oltin oy" — the golden moon. Used as the brand ornament. */
export const Moon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20.4 14.2A8.6 8.6 0 1 1 9.6 3.4a7 7 0 0 0 10.8 10.8z" />
  </Svg>
);

export const Tag = (p: IconProps) => (
  <Svg {...p}>
    <path d="M11.3 3.5H4.9a1.4 1.4 0 0 0-1.4 1.4v6.4a1.4 1.4 0 0 0 .4 1l7.8 7.8a1.4 1.4 0 0 0 2 0l6.4-6.4a1.4 1.4 0 0 0 0-2l-7.8-7.8a1.4 1.4 0 0 0-1-.4z" />
    <circle cx="8" cy="8" r="1.4" />
  </Svg>
);

/* ── States ────────────────────────────────────────────────────────────── */

export const CheckCircle = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="m8.4 12.2 2.4 2.4 4.8-5.2" />
  </Svg>
);

export const AlertCircle = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.6v5" />
    <circle cx="12" cy="16.1" r=".85" fill="currentColor" stroke="none" />
  </Svg>
);

export const Info = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 16.4v-4.8" />
    <circle cx="12" cy="8.2" r=".85" fill="currentColor" stroke="none" />
  </Svg>
);

export const Eye = (p: IconProps) => (
  <Svg {...p}>
    <path d="M2.6 12S6.2 5.9 12 5.9 21.4 12 21.4 12 17.8 18.1 12 18.1 2.6 12 2.6 12z" />
    <circle cx="12" cy="12" r="2.9" />
  </Svg>
);

export const Heart = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 20.3S4.3 15.6 4.3 10.6A4.3 4.3 0 0 1 12 7.9a4.3 4.3 0 0 1 7.7 2.7c0 5-7.7 9.7-7.7 9.7z" />
  </Svg>
);

/* ── Product categories ────────────────────────────────────────────────── */

/** Abaya — veiled silhouette in a full-length robe. */
export const Abaya = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8.5 8.6c0-2.6 1.5-4.7 3.5-4.7s3.5 2.1 3.5 4.7" />
    <path d="M9.4 8.5c.8.7 1.7 1.1 2.6 1.1s1.8-.4 2.6-1.1" />
    <path d="M8.5 8.6 5.8 20.4h12.4L15.5 8.6" />
  </Svg>
);

/** Ko'ylak — a long modest dress. */
export const Dress = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9.2 3.8h5.6l-.6 3.3 4.3 13.3H5.5L9.8 7.1z" />
    <path d="M9.8 7.1h4.4" />
  </Svg>
);

/** Ro'mol — folded, flowing cloth. */
export const Scarf = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.6 8.4c2.8-2.9 5.6-2.9 8.4 0s5.6 2.9 8.4 0" />
    <path d="M3.6 13.2c2.8-2.9 5.6-2.9 8.4 0s5.6 2.9 8.4 0" />
    <path d="M3.6 18c2.8-2.9 5.6-2.9 8.4 0s5.6 2.9 8.4 0" />
  </Svg>
);

/** To'plam — a boxed set. */
export const GiftSet = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.8 9.6h16.4v10.6H3.8z" />
    <path d="m3.8 9.6 1.5-3.4h13.4l1.5 3.4M12 6.2v14" />
    <path d="M12 6.2c-2 0-3.4-.5-3.4-1.6S10.4 3 12 6.2zM12 6.2c2 0 3.4-.5 3.4-1.6S13.6 3 12 6.2z" />
  </Svg>
);

/** Fallback for a category with no dedicated glyph. */
export const Hanger = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 8.6V7.4a2 2 0 1 1 2-2" />
    <path d="m12 8.6 8.2 6a1.3 1.3 0 0 1-.8 2.4H4.6a1.3 1.3 0 0 1-.8-2.4z" />
  </Svg>
);

/* ── Admin ─────────────────────────────────────────────────────────────── */

export const Dashboard = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 4h6.4v6.4H4zM13.6 4H20v4.2h-6.4zM13.6 11.4H20V20h-6.4zM4 13.6h6.4V20H4z" />
  </Svg>
);

export const Bag = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6.2 7.8h11.6l1 12.4H5.2z" />
    <path d="M9.2 7.8V6a2.8 2.8 0 0 1 5.6 0v1.8" />
  </Svg>
);

export const Inbox = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.6 13.4h4.2l1.2 2.4h6l1.2-2.4h4.2" />
    <path d="M3.6 13.4 5.9 5.6a1.4 1.4 0 0 1 1.3-1h9.6a1.4 1.4 0 0 1 1.3 1l2.2 7.8v4.6a1.6 1.6 0 0 1-1.6 1.6H5.2a1.6 1.6 0 0 1-1.6-1.6z" />
  </Svg>
);

export const Folder = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.6 7.2a1.6 1.6 0 0 1 1.6-1.6h3.6l2.2 2.4h7.4a1.6 1.6 0 0 1 1.6 1.6v8.6a1.6 1.6 0 0 1-1.6 1.6H5.2a1.6 1.6 0 0 1-1.6-1.6z" />
  </Svg>
);

export const PenLine = (p: IconProps) => (
  <Svg {...p}>
    <path d="m4 20 1-4.2L16.4 4.4a2 2 0 0 1 2.8 0l.4.4a2 2 0 0 1 0 2.8L8.2 19z" />
    <path d="m14.6 6.2 3.2 3.2" />
  </Svg>
);

export const Megaphone = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3.6 10.6v2.8a1.6 1.6 0 0 0 1.6 1.6h1.6l9 4.4V4.6l-9 4.4H5.2a1.6 1.6 0 0 0-1.6 1.6z" />
    <path d="M19 9.6a3.6 3.6 0 0 1 0 4.8M6.8 15v4.2h3.2v-3.4" />
  </Svg>
);

export const Settings = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.1 14.5a1.5 1.5 0 0 0 .3 1.7l.1.1a1.9 1.9 0 1 1-2.6 2.6l-.1-.1a1.5 1.5 0 0 0-1.7-.3 1.5 1.5 0 0 0-.9 1.4v.2a1.9 1.9 0 1 1-3.8 0v-.1a1.5 1.5 0 0 0-1-1.4 1.5 1.5 0 0 0-1.7.3l-.1.1a1.9 1.9 0 1 1-2.6-2.6l.1-.1a1.5 1.5 0 0 0 .3-1.7 1.5 1.5 0 0 0-1.4-.9h-.2a1.9 1.9 0 1 1 0-3.8h.1a1.5 1.5 0 0 0 1.4-1 1.5 1.5 0 0 0-.3-1.7l-.1-.1a1.9 1.9 0 1 1 2.6-2.6l.1.1a1.5 1.5 0 0 0 1.7.3h.1a1.5 1.5 0 0 0 .9-1.4v-.2a1.9 1.9 0 1 1 3.8 0v.1a1.5 1.5 0 0 0 .9 1.4 1.5 1.5 0 0 0 1.7-.3l.1-.1a1.9 1.9 0 1 1 2.6 2.6l-.1.1a1.5 1.5 0 0 0-.3 1.7v.1a1.5 1.5 0 0 0 1.4.9h.2a1.9 1.9 0 1 1 0 3.8h-.1a1.5 1.5 0 0 0-1.4.9z" />
  </Svg>
);

export const LogOut = (p: IconProps) => (
  <Svg {...p}>
    <path d="M9.5 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3.5" />
    <path d="m15.5 16.5 4.5-4.5-4.5-4.5M20 12H9.5" />
  </Svg>
);

export const Trash = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.6 7h14.8M9.6 7V5.6A1.6 1.6 0 0 1 11.2 4h1.6a1.6 1.6 0 0 1 1.6 1.6V7" />
    <path d="m6.6 7 .8 12a1.6 1.6 0 0 0 1.6 1.5h6a1.6 1.6 0 0 0 1.6-1.5l.8-12M10 11.2v5.6M14 11.2v5.6" />
  </Svg>
);

export const ImageIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="4.5" width="17" height="15" rx="2.2" />
    <circle cx="8.8" cy="9.8" r="1.6" />
    <path d="m4.2 17.2 4.8-4.4 4 3.4 3-2.4 4 3.4" />
  </Svg>
);

export const Users = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="9" cy="8" r="3.4" />
    <path d="M2.8 20a6.2 6.2 0 0 1 12.4 0" />
    <path d="M16.4 5.3a3.4 3.4 0 0 1 0 5.4M17.4 14.3A6.2 6.2 0 0 1 21.2 20" />
  </Svg>
);

export const TrendingUp = (p: IconProps) => (
  <Svg {...p}>
    <path d="m3.6 16.4 5.8-5.8 3.4 3.4 7.6-7.6" />
    <path d="M15.4 6.4h5v5" />
  </Svg>
);

/** Category slug → glyph. Falls back to the hanger. */
export const CATEGORY_ICON: Record<string, (p: IconProps) => React.ReactElement> = {
  abaya: Abaya,
  koylak: Dress,
  rumol: Scarf,
  toplam: GiftSet,
};

export function categoryIcon(slug: string) {
  return CATEGORY_ICON[slug] ?? Hanger;
}
