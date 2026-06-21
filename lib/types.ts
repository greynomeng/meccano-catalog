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
  "Other"
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
  Other: "#888780"
  // Structural: "#378add",
  // "Gears & Drives": "#639922",
  // Fasteners: "#ba7517",
  // "Wheels & Axles": "#993556",
  // "Plates & Brackets": "#533ab7",
  // Electrical: "#1d9e75",
  // Other: "#888780"
};

export const UNITS = ["pcs", "sets", "m", "mm", "kg", "g"];

// export const DEFAULT_PARTS: Part[] = [
//   {
//     partId: "5",
//     name: "Perforated Strip (5-hole, 6 cm)",
//     category: "Structural",
//     qty: 24,
//     unit: "pcs",
//     note: ""
//   },
//   {
//     partId: "9",
//     name: "Perforated Strip (11-hole, 14 cm)",
//     category: "Structural",
//     qty: 16,
//     unit: "pcs",
//     note: ""
//   },
//   {
//     partId: "7A",
//     name: "Angle Girder (48.5mm)",
//     category: "Structural",
//     qty: 8,
//     unit: "pcs",
//     note: ""
//   },
//   {
//     partId: "111C",
//     name: "M4 Hex Bolt 10mm",
//     category: "Fasteners",
//     qty: 120,
//     unit: "pcs",
//     note: ""
//   },
//   { partId: "MEK-005", name: "M4 Wing Nut", category: "Fasteners", qty: 80, unit: "pcs", note: "" },
//   {
//     partId: "27",
//     name: "Spur Gear (19 tooth)",
//     category: "Gears & Drives",
//     qty: 4,
//     unit: "pcs",
//     note: ""
//   },
//   {
//     partId: "MEK-007",
//     name: "Double Arm Crank",
//     category: "Gears & Drives",
//     qty: 2,
//     unit: "pcs",
//     note: ""
//   },
//   {
//     partId: "MEK-008",
//     name: "Wheel (57mm)",
//     category: "Wheels & Axles",
//     qty: 4,
//     unit: "pcs",
//     note: ""
//   },
//   {
//     partId: "MEK-009",
//     name: "Axle Rod (130mm)",
//     category: "Wheels & Axles",
//     qty: 6,
//     unit: "pcs",
//     note: ""
//   },
//   {
//     partId: "MEK-010",
//     name: "Flat Plate 2×5 holes",
//     category: "Plates & Brackets",
//     qty: 10,
//     unit: "pcs",
//     note: ""
//   }
// ];
