import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrderItem extends Document {
  product_id: mongoose.Types.ObjectId;
  variation: string;
  qty: number;
  created_at: Date;
  updated_at: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  variation: String,
  qty: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const OrderItem: Model<IOrderItem> =
  mongoose.models.OrderItem ||
  mongoose.model<IOrderItem>("OrderItem", OrderItemSchema);
