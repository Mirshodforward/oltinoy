/**
 * Dependency-free User-Agent parsing. A full UA library would add ~200 KB to the
 * server bundle to answer three questions we can answer with four regexes:
 * is this a bot, what kind of device, which OS, which browser.
 *
 * Deliberately coarse — the dashboard groups by these buckets, so "Chrome 131"
 * and "Chrome 132" are the same row anyway.
 */

const BOT_RE =
  /bot|crawler|spider|crawling|slurp|facebookexternalhit|preview|monitor|curl|wget|python-requests|axios|headless|lighthouse|pingdom|gtmetrix|semrush|ahrefs|dataprovider|phantomjs|scrapy/i;

/** Telegram's in-app WebView — a large share of this shop's traffic. */
const TELEGRAM_RE = /Telegram|TgWebView|TelegramBot/i;

const TABLET_RE = /iPad|Tablet|PlayBook|Silk|(Android(?!.*Mobile))/i;
const MOBILE_RE = /Mobi|Android|iPhone|iPod|IEMobile|BlackBerry|Opera Mini/i;

export type DeviceType = "mobile" | "tablet" | "desktop";

export type ParsedUa = {
  isBot: boolean;
  isTelegram: boolean;
  device: DeviceType;
  os: string | null;
  browser: string | null;
};

function parseOs(ua: string): string | null {
  if (/Windows NT 10/.test(ua)) return "Windows 10/11";
  if (/Windows NT/.test(ua)) return "Windows";
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS";
  if (/Mac OS X/.test(ua)) return "macOS";
  if (/Android/.test(ua)) return "Android";
  if (/CrOS/.test(ua)) return "ChromeOS";
  if (/Linux/.test(ua)) return "Linux";
  return null;
}

function parseBrowser(ua: string): string | null {
  // Order matters: every Chromium browser also claims "Chrome", and every
  // WebKit browser also claims "Safari".
  if (/YaBrowser/.test(ua)) return "Yandex";
  if (/OPR\/|Opera/.test(ua)) return "Opera";
  if (/Edg\//.test(ua)) return "Edge";
  if (/SamsungBrowser/.test(ua)) return "Samsung Internet";
  if (/MiuiBrowser/.test(ua)) return "Mi Browser";
  if (/UCBrowser/.test(ua)) return "UC Browser";
  if (/Firefox\/|FxiOS/.test(ua)) return "Firefox";
  if (/Chrome\/|CriOS/.test(ua)) return "Chrome";
  if (/Safari\//.test(ua)) return "Safari";
  return null;
}

export function parseUa(uaRaw: string | null | undefined): ParsedUa {
  const ua = uaRaw ?? "";
  if (!ua) {
    return { isBot: true, isTelegram: false, device: "desktop", os: null, browser: null };
  }

  const device: DeviceType = TABLET_RE.test(ua) ? "tablet" : MOBILE_RE.test(ua) ? "mobile" : "desktop";

  return {
    isBot: BOT_RE.test(ua),
    isTelegram: TELEGRAM_RE.test(ua),
    device,
    os: parseOs(ua),
    browser: parseBrowser(ua),
  };
}
