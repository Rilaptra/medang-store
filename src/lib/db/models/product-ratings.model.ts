// models/ProductRating.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProductRating extends Document {
  user_id: mongoose.Types.ObjectId;
  product_id: mongoose.Types.ObjectId;
  rating_value: number;
  review?: string;
  created_at: Date;
  updated_at: Date;
}

const ProductRatingSchema = new Schema<IProductRating>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  product_id: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  rating_value: { type: Number, min: 1, max: 5, required: true },
  review: String,
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const ProductRating: Model<IProductRating> =
  mongoose.models.ProductRating ||
  mongoose.model<IProductRating>("ProductRating", ProductRatingSchema);
