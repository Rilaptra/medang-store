// src/lib/db/models/cart.model.ts

import mongoose, { Schema, Document, Model } from "mongoose";
import { IOrderItem } from "./order-item.model";
import { IUser } from "./user.model";

export interface ICart {
  buyer_id: IUser;
  items: IOrderItem[]; // Reintroduce the items array
  created_at: Date;
  updated_at: Date;
  _id?: string;
}

export interface ICartDoc extends Document {
  buyer_id: mongoose.Types.ObjectId;
  items: mongoose.Types.ObjectId[]; // Reintroduce the items array
  created_at: Date;
  updated_at: Date;
}

const CartSchema = new Schema<ICartDoc>({
  buyer_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    description: "User yang membuat cart",
  },
  items: [
    {
      // Reintroduce the items array
      type: Schema.Types.ObjectId,
      ref: "OrderItem",
    },
  ],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const Cart: Model<ICartDoc> =
  mongoose.models.Cart || mongoose.model<ICartDoc>("Cart", CartSchema);
