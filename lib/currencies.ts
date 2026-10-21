export interface Currency { code: string; rate: number } // rate = units of this currency per 1 USD

export const RATES_DATE = "15 Oct 2026";

export const CURRENCIES: Record<string, Currency> = {
  USD: { code: "USD", rate: 1 },
  EUR: { code: "EUR", rate: 0.894425 },
  GBP: { code: "GBP", rate: 0.756165 },
  CHF: { code: "CHF", rate: 0.833623 },
  RUB: { code: "RUB", rate: 83.931439 },
  TRY: { code: "TRY", rate: 49.45021 },
  CAD: { code: "CAD", rate: 1.422795 },
  KRW: { code: "KRW", rate: 1339.811585 },
  JPY: { code: "JPY", rate: 158.305497 },
  AUD: { code: "AUD", rate: 1.433021 },
  NZD: { code: "NZD", rate: 1.784407 },
  SGD: { code: "SGD", rate: 1.283055 },
  INR: { code: "INR", rate: 95.252751 },
  IDR: { code: "IDR", rate: 17907.815096 },
  VND: { code: "VND", rate: 25890.201508 },
  PHP: { code: "PHP", rate: 62.922028 },
  MYR: { code: "MYR", rate: 4.082359 },
  THB: { code: "THB", rate: 33.627869 },
  AED: { code: "AED", rate: 3.6725 },
  MXN: { code: "MXN", rate: 18.464303 },
  ARS: { code: "ARS", rate: 1514.5655 },
  BRL: { code: "BRL", rate: 5.035924 },
  COP: { code: "COP", rate: 3182.996886 },
  CLP: { code: "CLP", rate: 981.815969 },
  VES: { code: "VES", rate: 879.1225 },
  PEN: { code: "PEN", rate: 3.440036 },
};

const BY_JURISDICTION: Record<string, string> = {
  EU: "EUR", FR: "EUR", DE: "EUR", UK: "GBP", CH: "CHF", RU: "RUB", TR: "TRY",
  US: "USD", CA: "CAD", KR: "KRW", JP: "JPY", AU: "AUD", NZ: "NZD", SG: "SGD",
  IN: "INR", ID: "IDR", VN: "VND", PH: "PHP", MY: "MYR", TH: "THB", AE: "AED",
  MX: "MXN", AR: "ARS", BR: "BRL", CO: "COP", CL: "CLP", VE: "VES", PE: "PEN",
};

/** OTHER (and anything unknown) falls back to USD. */
export const currencyFor = (region: string): Currency => CURRENCIES[BY_JURISDICTION[region] ?? "USD"];

export const toUsd = (local: number, c: Currency) => local / c.rate;
export const toLocal = (usd: number, c: Currency) => usd * c.rate;

/** Round to 1 significant digit: 124 -> 100, 41698 -> 40000. */
export function niceRound(x: number): number {
  if (!isFinite(x) || x <= 0) return 0;
  const p = 10 ** Math.floor(Math.log10(x));
  return Math.round(x / p) * p;
}

export const PRESETS_USD = [100, 500, 5000, 25000];
export const presetsFor = (c: Currency) => PRESETS_USD.map((u) => niceRound(toLocal(u, c)));

/** Whole-unit amounts (inputs, presets). */
export const formatAmount = (local: number, c: Currency) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c.code, maximumFractionDigits: 0 }).format(local);

/** A USD cost, displayed in the user's currency (decimals only for low-value-per-unit currencies). */
export function formatUsd(usd: number, c: Currency) {
  const d = c.rate >= 100 ? 0 : 2;
  return new Intl.NumberFormat("en-US", { style: "currency", currency: c.code, minimumFractionDigits: d, maximumFractionDigits: d }).format(toLocal(usd, c));
}