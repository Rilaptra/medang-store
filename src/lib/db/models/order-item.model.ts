// src/lib/models/order-item.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import { IProduct } from "./product.model";

export interface IOrderItem {
  product_id: IProduct;
  variation: string;
  qty: number;
  created_at: Date;
  updated_at: Date;
  _id: string;
}
export interface IOrderItemDoc extends Document {
  product_id: mongoose.Types.ObjectId;
  variation: string;
  qty: number;
  created_at: Date;
  updated_at: Date;
}

const OrderItemSchema = new Schema<IOrderItemDoc>({
  product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  variation: String,
  qty: { type: Number, default: 1 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const OrderItem: Model<IOrderItemDoc> =
  mongoose.models.OrderItem ||
  mongoose.model<IOrderItemDoc>("OrderItem", OrderItemSchema);
