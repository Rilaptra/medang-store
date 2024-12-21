import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./user.model";

export interface IVariation {
  variant_title: string;
  price: number;
  stock: number;
  images: string[];
}
export interface IProduct {
  seller_id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  discount_value: number;
  discount_type: "percent" | "value";
  category: string;
  variations: IVariation[];
  purchased_by: Pick<IUser, "username" | "website_sosmed_link" | "name">[];
  isActive: boolean;
  isPreOrder: boolean;
  created_at: Date;
  updated_at: Date;
  _id?: string;
}

export interface IProductDoc extends Document {
  seller_id: string;
  title: string;
  description: string;
  discount: number;
  discount_value: number;
  discount_type: "percent" | "value";
  category: string;
  variations: IVariation[];
  purchased_by: Pick<IUser, "username" | "website_sosmed_link" | "name">[];
  isActive: boolean;
  isPreOrder: boolean;
  created_at: Date;
  updated_at: Date;
}

const ProductSchema = new Schema<IProductDoc>({
  seller_id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, maxlength: 15000 },
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
      variant_title: String,
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

export const Product: Model<IProductDoc> =
  mongoose.models.Product ||
  mongoose.model<IProductDoc>("Product", ProductSchema);
