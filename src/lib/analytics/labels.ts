/** Raw dimension values → the words an Uzbek-speaking admin actually uses. */

export const DEVICE_UZ: Record<string, string> = {
  mobile: "Telefon",
  tablet: "Planshet",
  desktop: "Kompyuter",
};

export const LOCALE_UZ: Record<string, string> = {
  uz: "O'zbekcha",
  ru: "Ruscha",
};

/** Country codes seen in this shop's traffic; anything else falls back to the code. */
const COUNTRY_UZ: Record<string, string> = {
  UZ: "O'zbekiston",
  RU: "Rossiya",
  KZ: "Qozog'iston",
  KG: "Qirg'iziston",
  TJ: "Tojikiston",
  TM: "Turkmaniston",
  TR: "Turkiya",
  AE: "BAA",
  SA: "Saudiya Arabistoni",
  US: "AQSh",
  GB: "Buyuk Britaniya",
  DE: "Germaniya",
  KR: "Janubiy Koreya",
  CN: "Xitoy",
  UA: "Ukraina",
  AZ: "Ozarbayjon",
  BY: "Belarus",
  PL: "Polsha",
};

export function countryLabel(code: string): string {
  return COUNTRY_UZ[code] ?? code;
}

export function deviceLabel(v: string): string {
  return DEVICE_UZ[v] ?? v;
}

export function localeLabel(v: string): string {
  return LOCALE_UZ[v] ?? v;
}
