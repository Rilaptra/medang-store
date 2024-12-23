import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVariation {
  variant_title: string;
  price: number;
  stock: number;
  images: string[];
  discount: number;
  discount_value: number;
  discount_type: "percent" | "value";
}
export interface IProduct {
  seller_id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  variations: IVariation[];
  purchased_by: mongoose.Types.ObjectId[];
  isActive: boolean;
  isPreOrder: boolean;
  created_at: Date;
  updated_at: Date;
  _id?: string;
}

export interface IProductDoc extends Document {
  seller_id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  variations: IVariation[];
  purchased_by: mongoose.Types.ObjectId[];
  isActive: boolean;
  isPreOrder: boolean;
  created_at: Date;
  updated_at: Date;
}

const ProductSchema = new Schema<IProductDoc>({
  seller_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, maxlength: 15000 },
  category: String,
  variations: [
    {
      variant_title: String,
      price: Number,
      stock: Number,
      images: [String],
      discount: { type: Number, min: 0, max: 100, default: 0 },
      discount_value: { type: Number, default: 0 },
      discount_type: {
        type: String,
        enum: ["percent", "value"],
        default: "percent",
      },
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
