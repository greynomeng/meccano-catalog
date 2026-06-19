export type Category =
  | "Structural"
  | "Gears & Drives"
  | "Fasteners"
  | "Wheels & Axles"
  | "Plates & Brackets"
  | "Electrical"
  | "Other";

export interface Part {
  id: string;
  name: string;
  category: Category;
  qty: number;
  unit: string;
  note: string;
}

export const CATEGORIES: Category[] = [
  "Structural",
  "Gears & Drives",
  "Fasteners",
  "Wheels & Axles",
  "Plates & Brackets",
  "Electrical",
  "Other"
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Structural: "#378add",
  "Gears & Drives": "#639922",
  Fasteners: "#ba7517",
  "Wheels & Axles": "#993556",
  "Plates & Brackets": "#533ab7",
  Electrical: "#1d9e75",
  Other: "#888780"
};

export const UNITS = ["pcs", "sets", "m", "mm", "kg", "g"];
