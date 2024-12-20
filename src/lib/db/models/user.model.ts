import mongoose, { Schema, Document, Model } from "mongoose";
export interface IUser {
  username: string;
  hash: string;
  email: string;
  name?: string;
  profile_picture?: string;
  role: "member" | "admin" | "seller";
  kelas?: string;
  nomor_kelas?: string;
  phone_number?: string;
  bio?: string;
  website_sosmed_link?: string;
  verified: boolean;
  followers: mongoose.Types.ObjectId[];
  created_at: Date;
  _id?: string;
}
export interface IUserDoc extends Document {
  username: string;
  hash: string;
  email: string;
  name?: string;
  profile_picture?: string;
  role: "member" | "admin" | "seller";
  kelas?: string;
  nomor_kelas?: string;
  phone_number?: string;
  bio?: string;
  website_sosmed_link?: string;
  verified: boolean;
  followers: mongoose.Types.ObjectId[];
  created_at: Date;
}

const UserSchema = new Schema<IUserDoc>({
  username: { type: String, required: true, unique: true },
  hash: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: String,
  profile_picture: { type: String, default: "" },
  role: {
    type: String,
    enum: ["member", "admin", "seller"],
    required: true,
    default: "member",
  },
  kelas: { type: String, default: "XII-F" },
  nomor_kelas: String,
  phone_number: String,
  bio: { type: String, maxlength: 1000, default: "Write your bio here" },
  website_sosmed_link: {
    type: String,
    default: "https://www.instagram.com/username",
  },
  verified: { type: Boolean, default: false },
  followers: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
  created_at: { type: Date, default: Date.now() },
});

export const User: Model<IUserDoc> =
  mongoose.models.User || mongoose.model<IUserDoc>("User", UserSchema);
