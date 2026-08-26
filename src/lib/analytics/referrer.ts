/**
 * Referrer + UTM classification — the "qayerdan kirgan" half of the dashboard.
 *
 * A referrer is bucketed once, at session start, and stored denormalised on the
 * session row so the acquisition report never has to parse URLs at query time.
 */

export type RefType = "direct" | "search" | "social" | "telegram" | "referral";

const SEARCH = [
  "google.",
  "yandex.",
  "bing.com",
  "duckduckgo.com",
  "yahoo.",
  "mail.ru",
  "search.",
  "ecosia.org",
  "baidu.com",
];

const SOCIAL = [
  "instagram.com",
  "facebook.com",
  "fb.com",
  "tiktok.com",
  "youtube.com",
  "youtu.be",
  "twitter.com",
  "x.com",
  "vk.com",
  "ok.ru",
  "pinterest.",
  "linkedin.com",
  "threads.net",
  "snapchat.com",
];

const TELEGRAM = ["t.me", "telegram.org", "telegram.me", "web.telegram.org"];

function matches(host: string, list: string[]): boolean {
  return list.some((needle) => host === needle || host.includes(needle));
}

export function classifyReferrer(
  referrer: string | null | undefined,
  selfHost: string,
): { refType: RefType; refHost: string | null } {
  if (!referrer) return { refType: "direct", refHost: null };

  let host: string;
  try {
    host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return { refType: "direct", refHost: null };
  }

  // Same-site navigation is not acquisition — the session already has its source.
  const self = selfHost.toLowerCase().replace(/^www\./, "");
  if (host === self) return { refType: "direct", refHost: null };

  if (matches(host, TELEGRAM)) return { refType: "telegram", refHost: host };
  if (matches(host, SEARCH)) return { refType: "search", refHost: host };
  if (matches(host, SOCIAL)) return { refType: "social", refHost: host };
  return { refType: "referral", refHost: host };
}

export type Utm = {
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  utmTerm: string | null;
  utmContent: string | null;
};

const EMPTY_UTM: Utm = {
  utmSource: null,
  utmMedium: null,
  utmCampaign: null,
  utmTerm: null,
  utmContent: null,
};

/** Reads utm_* off a landing URL's query string. Values are capped defensively. */
export function parseUtm(url: string | null | undefined): Utm {
  if (!url) return EMPTY_UTM;
  let params: URLSearchParams;
  try {
    params = new URL(url, "https://placeholder.local").searchParams;
  } catch {
    return EMPTY_UTM;
  }
  const get = (key: string) => {
    const v = params.get(key);
    return v ? v.slice(0, 120) : null;
  };
  return {
    utmSource: get("utm_source"),
    utmMedium: get("utm_medium"),
    utmCampaign: get("utm_campaign"),
    utmTerm: get("utm_term"),
    utmContent: get("utm_content"),
  };
}

/** Human-readable Uzbek labels for the acquisition buckets. */
export const REF_TYPE_UZ: Record<RefType, string> = {
  direct: "To'g'ridan-to'g'ri",
  search: "Qidiruv tizimlari",
  social: "Ijtimoiy tarmoqlar",
  telegram: "Telegram",
  referral: "Boshqa saytlar",
};
