import mongoose, { Schema, Document, Model } from "mongoose";
import { Category, CATEGORIES, UNITS } from "./types";

export interface PartDocument extends Document {
  partId: string; // Human-readable ID e.g. MEK-001
  name: string;
  category: Category;
  qty: number;
  unit: string;
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

const PartSchema = new Schema<PartDocument>(
  {
    partId: {
      type: String,
      required: [true, "Part ID is required"],
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [120, "Name must be 120 characters or fewer"]
    },
    category: {
      type: String,
      required: true,
      enum: { values: CATEGORIES, message: "{VALUE} is not a valid category" }
    },
    qty: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"],
      default: 0
    },
    unit: {
      type: String,
      required: true,
      enum: { values: UNITS, message: "{VALUE} is not a valid unit" },
      default: "pcs"
    },
    note: {
      type: String,
      default: "",
      maxlength: [300, "Note must be 300 characters or fewer"]
    }
  },
  {
    timestamps: true, // adds createdAt + updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index for fast category filtering and text search
PartSchema.index({ category: 1 });
PartSchema.index({ name: "text", partId: "text" });

// Prevent model re-compilation during Next.js hot-reload
const PartModel: Model<PartDocument> =
  (mongoose.models.Part as Model<PartDocument>) ?? mongoose.model<PartDocument>("Part", PartSchema);

export default PartModel;
