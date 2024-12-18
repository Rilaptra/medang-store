// models/Banner.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBanner extends Document {
  image_url: string;
  link: string;
  owner_id?: mongoose.Types.ObjectId;
  size: "big" | "medium" | "small";
  created_at: Date;
  updated_at: Date;
}

const BannerSchema = new Schema<IBanner>({
  image_url: { type: String, required: true },
  link: { type: String, required: true },
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    description: "Pengguna yang punya iklan ini",
  },
  size: {
    type: String,
    enum: ["big", "medium", "small"],
    required: true,
    default: "small", // Default to small
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const Banner: Model<IBanner> =
  mongoose.models.Banner || mongoose.model<IBanner>("Banner", BannerSchema);
