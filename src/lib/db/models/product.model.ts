import mongoose, { Schema, Document, Model } from "mongoose";

interface IVariation {
  variant_name: string;
  price: number;
  stock: number;
  images: string[];
}

export interface IProduct extends Document {
  seller_id: mongoose.Types.ObjectId;
  name: string;
  description: string;
  price: number;
  discount: number;
  discount_value: number;
  discount_type: "percent" | "value";
  category: string;
  variations: IVariation[];
  purchased_by: mongoose.Types.ObjectId[];
  isActive: boolean;
  isPreOrder: boolean;
  created_at: Date;
  updated_at: Date;
}

const ProductSchema = new Schema<IProduct>({
  seller_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: { type: String, maxlength: 15000 },
  price: { type: Number, required: true },
  discount: { type: Number, min: 0, max: 100, default: 0 },
  discount_value: { type: Number, default: 0 },
  discount_type: {
    type: String,
    enum: ["percent", "value"],
    default: "percent",
  },
  category: String,
  variations: [
    {
      variant_name: String,
      price: Number,
      stock: Number,
      images: [String],
    },
  ],
  purchased_by: [{ type: Schema.Types.ObjectId, ref: "User" }],
  isActive: { type: Boolean, default: true },
  isPreOrder: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);
