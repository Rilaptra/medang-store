import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  username: string;
  hash: string;
  email: string;
  name?: string;
  profile_picture?: string;
  role: "member" | "admin" | "superadmin";
  kelas?: string;
  nomor_kelas?: string;
  phone_number?: string;
  bio?: string;
  website_sosmed_link?: string;
  verified: boolean;
  followers: mongoose.Types.ObjectId[];
  created_at: Date;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  hash: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  name: String,
  profile_picture: String,
  role: {
    type: String,
    enum: ["member", "admin", "superadmin"],
    required: true,
    default: "member",
  },
  kelas: String,
  nomor_kelas: String,
  phone_number: String,
  bio: { type: String, maxlength: 1000 },
  website_sosmed_link: String,
  verified: { type: Boolean, default: false },
  followers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  created_at: { type: Date, default: Date.now },
});

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
