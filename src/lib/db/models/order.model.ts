import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  buyer_id: mongoose.Types.ObjectId;
  seller_id: mongoose.Types.ObjectId;
  items: mongoose.Types.ObjectId[];
  total_amount: number;
  order_date: Date;
  payment_status: "pending" | "success" | "failed";
  shipping_status: "pending" | "shipped" | "delivered";
  voucher_id?: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const OrderSchema = new Schema<IOrder>({
  buyer_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  seller_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      type: Schema.Types.ObjectId,
      ref: "OrderItem",
    },
  ],
  total_amount: { type: Number, required: true },
  order_date: { type: Date, default: Date.now },
  payment_status: {
    type: String,
    enum: ["pending", "success", "failed"],
    default: "pending",
  },
  shipping_status: {
    type: String,
    enum: ["pending", "shipped", "delivered"],
    default: "pending",
  },
  voucher_id: {
    type: Schema.Types.ObjectId,
    ref: "Voucher",
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
