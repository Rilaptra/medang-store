import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVoucher extends Document {
  title: string;
  expired_at: Date;
  owner_id?: mongoose.Types.ObjectId;
  code: string;
  discount: number;
  products: mongoose.Types.ObjectId[];
  created_at: Date;
  updated_at: Date;
}

const VoucherSchema = new Schema<IVoucher>({
  title: { type: String, required: true },
  expired_at: { type: Date, required: true },
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  discount: {
    type: Number,
    min: 0,
    max: 100,
  },
  products: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const Voucher: Model<IVoucher> =
  mongoose.models.Voucher || mongoose.model<IVoucher>("Voucher", VoucherSchema);
