import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWebStatic extends Document {
  owner_id?: mongoose.Types.ObjectId;
  title: string;
  image_url?: string;
  content: string;
  slug: string;
  created_at: Date;
  updated_at: Date;
}

const WebStaticSchema = new Schema<IWebStatic>({
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: { type: String, required: true, description: "Judul konten" },
  image_url: { type: String, description: "URL gambar (opsional)" },
  content: { type: String, required: true, description: "Isi konten" },
  slug: {
    type: String,
    unique: true,
    required: true,
    description: "url untuk halaman",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const WebStatic: Model<IWebStatic> =
  mongoose.models.WebStatic ||
  mongoose.model<IWebStatic>("WebStatic", WebStaticSchema);
