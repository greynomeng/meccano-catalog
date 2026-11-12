// lib/types.ts

export type Category =
  | "Plates"
  | "Strips"
  | "Girders"
  | "Brackets"
  | "Axles"
  | "Wheels"
  | "Gears"
  | "Bolts & Nuts"
  | "Pulleys"
  | "Motors & Electrical"
  | "Other";

export interface Part {
  partId: string;
  name: string;
  description: string;
  category: Category;
  qty: number;
  unit: string;
  note: string;
  imageUrl?: string;
}

export const CATEGORIES: Category[] = [
  "Plates",
  "Strips",
  "Girders",
  "Brackets",
  "Axles",
  "Wheels",
  "Gears",
  "Bolts & Nuts",
  "Pulleys",
  "Motors & Electrical",
  "Other",
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Plates: "#533ab7",
  Strips: "#378add",
  Girders: "#378add",
  Brackets: "#533ab7",
  Axles: "#993556",
  Wheels: "#993556",
  Gears: "#639922",
  "Bolts & Nuts": "#ba7517",
  Pulleys: "#639922",
  "Motors & Electrical": "#1d9e75",
  Other: "#888780",
};

export const UNITS = ["pcs", "sets", "m", "mm", "kg", "g"];
