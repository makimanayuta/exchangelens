import { Frequency, Goal, Priority } from "./types";

export const GOALS: { value: Goal; label: string; hint: string }[] = [
  { value: "spot", label: "Buy or sell crypto and own it", hint: "Spot" },
  { value: "perp", label: "Trade perpetual futures", hint: "Leverage" },
  { value: "dex", label: "Trade on-chain with a wallet", hint: "DEX" },
  { value: "all", label: "Compare everything", hint: "All venues" },
];
export const SIZES = [
  { value: 100, label: "Around €100" },
  { value: 500, label: "Around €500" },
  { value: 5000, label: "Around €5,000" },
  { value: 25000, label: "€25,000 or more" },
];
export const FREQS: { value: Frequency; label: string; trades: number }[] = [
  { value: "occasional", label: "Occasionally: buying and holding", trades: 2 },
  { value: "regular", label: "Regularly: several trades a week", trades: 12 },
  { value: "active", label: "Actively: many trades per day", trades: 120 },
];
export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "balanced", label: "Best overall balance" },
  { value: "cost", label: "Lowest total cost" },
  { value: "liquidity", label: "Liquidity & execution quality" },
  { value: "simple", label: "Simplicity & ease of use" },
  { value: "assets", label: "Wide selection of coins" },
];