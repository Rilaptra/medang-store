import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICart extends Document {
  buyer_id: mongoose.Types.ObjectId;
  seller_id: mongoose.Types.ObjectId;
  items: mongoose.Types.ObjectId[]; // Reintroduce the items array
  created_at: Date;
  updated_at: Date;
}

const CartSchema = new Schema<ICart>({
  buyer_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    description: "User yang membuat cart",
  },
  seller_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    description: "User sebagai penjual",
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

export const Cart: Model<ICart> =
  mongoose.models.Cart || mongoose.model<ICart>("Cart", CartSchema);
