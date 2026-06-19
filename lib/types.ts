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

export const DEFAULT_PARTS: Part[] = [
  {
    id: "5",
    name: "Perforated Strip (5-hole, 6 cm)",
    category: "Structural",
    qty: 24,
    unit: "pcs",
    note: ""
  },
  {
    id: "9",
    name: "Perforated Strip (11-hole)",
    category: "Structural",
    qty: 16,
    unit: "pcs",
    note: ""
  },
  {
    id: "7A",
    name: "Angle Girder (48.5mm)",
    category: "Structural",
    qty: 8,
    unit: "pcs",
    note: ""
  },
  {
    id: "111C",
    name: "M4 Hex Bolt 10mm",
    category: "Fasteners",
    qty: 120,
    unit: "pcs",
    note: ""
  },
  { id: "MEK-005", name: "M4 Wing Nut", category: "Fasteners", qty: 80, unit: "pcs", note: "" },
  {
    id: "27",
    name: "Spur Gear (19 tooth)",
    category: "Gears & Drives",
    qty: 4,
    unit: "pcs",
    note: ""
  },
  {
    id: "MEK-007",
    name: "Double Arm Crank",
    category: "Gears & Drives",
    qty: 2,
    unit: "pcs",
    note: ""
  },
  {
    id: "MEK-008",
    name: "Wheel (57mm)",
    category: "Wheels & Axles",
    qty: 4,
    unit: "pcs",
    note: ""
  },
  {
    id: "MEK-009",
    name: "Axle Rod (130mm)",
    category: "Wheels & Axles",
    qty: 6,
    unit: "pcs",
    note: ""
  },
  {
    id: "MEK-010",
    name: "Flat Plate 2×5 holes",
    category: "Plates & Brackets",
    qty: 10,
    unit: "pcs",
    note: ""
  }
];
