# Use this as context for doing tasks

## Mongoose Database Models

```typescript
// src/lib/models/order-item.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";
import { IProduct } from "./product.model";

export interface IOrderItem extends Document {
  product_id: IProduct;
  variation: string;
  qty: number;
  created_at: Date;
  updated_at: Date;
  _id: mongoose.Types.ObjectId;
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

// src/lib/db/models/cart.model.ts

import mongoose, { Schema, Document, Model } from "mongoose";
import { IOrderItem } from "./order-item.model";
import { IUser } from "./user.model";

export interface ICart {
  buyer_id: IUser;
  seller_id: IUser;
  items: IOrderItem[]; // Reintroduce the items array
  created_at: Date;
  updated_at: Date;
  _id?: string;
}

export interface ICartDoc extends Document {
  buyer_id: mongoose.Types.ObjectId;
  seller_id: mongoose.Types.ObjectId;
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

export const Cart: Model<ICartDoc> =
  mongoose.models.Cart || mongoose.model<ICartDoc>("Cart", CartSchema);

// src/lib/db/models/order.model.ts

import mongoose, { Schema, Document, Model } from "mongoose";
import { IVoucher } from "./voucher.model";
import { IOrderItem } from "./order-item.model";
import { IUser } from "./user.model";

export interface IOrder {
  buyer_id: IUser;
  seller_id: IUser;
  items: IOrderItem[];
  total_amount: number;
  order_date: Date;
  payment_status: "pending" | "success" | "failed";
  shipping_status: "pending" | "shipped" | "delivered";
  voucher_id?: IVoucher;
  created_at: Date;
  updated_at: Date;
}

export interface IOrderDoc extends Document {
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

const OrderSchema = new Schema<IOrderDoc>({
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

export const Order: Model<IOrderDoc> =
  mongoose.models.Order || mongoose.model<IOrderDoc>("Order", OrderSchema);

// src/lib/models/product.model.ts

import mongoose, { Schema, Document, Model } from "mongoose";
import { IUser } from "./user.model";

export interface IVariation {
  variant_title: string;
  price: number;
  stock: number;
  images: string[];
  discount: number;
  discount_value: number;
  discount_type: "percent" | "value";
}
export interface IProduct {
  seller_id: IUser;
  title: string;
  description: string;
  category: string;
  variations: IVariation[];
  purchased_by: mongoose.Types.ObjectId[];
  isActive: boolean;
  isPreOrder: boolean;
  created_at: Date;
  updated_at: Date;
  _id?: string;
}

export interface IProductDoc extends Document {
  seller_id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  category: string;
  variations: IVariation[];
  purchased_by: mongoose.Types.ObjectId[];
  isActive: boolean;
  isPreOrder: boolean;
  created_at: Date;
  updated_at: Date;
}

const ProductSchema = new Schema<IProductDoc>({
  seller_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, maxlength: 15000 },
  category: String,
  variations: [
    {
      variant_title: String,
      price: Number,
      stock: Number,
      images: [String],
      discount: { type: Number, min: 0, max: 100, default: 0 },
      discount_value: { type: Number, default: 0 },
      discount_type: {
        type: String,
        enum: ["percent", "value"],
        default: "percent",
      },
    },
  ],
  purchased_by: [{ type: Schema.Types.ObjectId, ref: "User" }],
  isActive: { type: Boolean, default: true },
  isPreOrder: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

export const Product: Model<IProductDoc> =
  mongoose.models.Product ||
  mongoose.model<IProductDoc>("Product", ProductSchema);

// src/lib/db/models/user.models.ts

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
  created_at: { type: Date, default: Date.now },
});

export const User: Model<IUserDoc> =
  mongoose.models.User || mongoose.model<IUserDoc>("User", UserSchema);

// src/lib/models/voucher.model.ts

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVoucher {
  title: string;
  expired_at: Date;
  owner_id?: mongoose.Types.ObjectId;
  code: string;
  discount: number;
  products: mongoose.Types.ObjectId[];
  created_at: Date;
  updated_at: Date;
}

export interface IVoucherDoc extends Document {
  title: string;
  expired_at: Date;
  owner_id?: mongoose.Types.ObjectId;
  code: string;
  discount: number;
  products: mongoose.Types.ObjectId[];
  created_at: Date;
  updated_at: Date;
}

const VoucherSchema = new Schema<IVoucherDoc>({
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

export const Voucher: Model<IVoucherDoc> =
  mongoose.models.Voucher ||
  mongoose.model<IVoucherDoc>("Voucher", VoucherSchema);
```

## Custom Function / Components / Page (.tsx)

```tsx
// src/app/cart/page.tsx

"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";
import { FaTrash } from "react-icons/fa";
import Image from "next/image";
import { ICart } from "@/lib/db/models/cart.model";
import { IVariation } from "@/lib/db/models/product.model";

const CartPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { cart, items, setCart, setItems, setLoading, setError, loading } =
    useCartStore();
  const [totalAmount, setTotalAmount] = useState(0);
  const [cartUpdated, setCartUpdated] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      if (status === "loading") {
        return;
      }

      if (!session?.user?.id) {
        router.push("/login");
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/cart?buyer_id=${session.user.id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to fetch cart data with userId"
          );
        }
        const { cart: fetchedCart } = (await response.json()) as {
          cart: ICart;
        };
        console.log("here your cart", cart);

        setCart(fetchedCart);
        setItems(fetchedCart.items);
      } catch (error: any) {
        setError(error.message);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [
    session?.user?.id,
    status,
    router,
    setCart,
    setItems,
    setLoading,
    setError,
  ]);

  useEffect(() => {
    if (items) {
      const calculateTotal = async () => {
        let total = 0;
        for (const item of items) {
          try {
            const response = await fetch(`/api/products/${item.product_id}`);
            if (!response.ok) {
              throw new Error(
                `Failed to fetch product data for id ${item.product_id}`
              );
            }
            const { product } = await response.json();
            if (product) {
              const variation = product.variations?.find(
                (v: any) => v.variant_title === item.variation
              );
              if (variation) {
                let discountedPrice = variation.price;
                if (variation.discount > 0) {
                  if (variation.discount_type === "percent") {
                    discountedPrice =
                      variation.price -
                      (variation.price * variation.discount) / 100;
                  } else if (variation.discount_type === "value") {
                    discountedPrice =
                      variation.price - variation.discount_value;
                  }
                }
                total += discountedPrice * item.qty;
              }
            }
          } catch (error: any) {
            toast.error(error.message);
            console.error(error);
          }
        }
        setTotalAmount(total);
      };
      calculateTotal();
    }
  }, [items, cartUpdated]);

  const handleRemoveItem = async (itemId: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ item_id: itemId, cart_id: cart?._id }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete item");
      }

      toast.success("Item removed from cart!");
      setCartUpdated(!cartUpdated);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (items && items.length > 0) {
      router.push("/checkout");
    } else {
      toast.error("Your cart is empty");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div>loading</div>
      // <div className="container mx-auto py-10">
      //   <h2 className="text-2xl font-bold mb-4">
      //     <Skeleton className="h-8 w-60" />
      //   </h2>
      //   <div className="space-y-4">
      //     {Array.from({ length: 3 }).map((_, index) => (
      //       <Card key={index}>
      //         <CardHeader>
      //           <CardTitle>
      //             <Skeleton className="h-6 w-48" />
      //           </CardTitle>
      //           <CardDescription>
      //             <Skeleton className="h-4 w-32" />
      //           </CardDescription>
      //         </CardHeader>
      //         <CardContent className="grid grid-cols-3 gap-4">
      //           <Skeleton className="h-24 w-24" />
      //           <div className="col-span-2 space-y-2">
      //             <Skeleton className="h-4 w-48" />
      //             <Skeleton className="h-4 w-32" />
      //             <Skeleton className="h-4 w-24" />
      //           </div>
      //         </CardContent>
      //       </Card>
      //     ))}
      //   </div>
      // </div>
    );
  }

  if (!session?.user?.id) {
    return null; // Or a better fallback
  }

  if (!cart || !items || items.length === 0) {
    return (
      <div className="container mx-auto py-10 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
        <p className="text-gray-500">Your cart is currently empty.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      <div className="space-y-4">
        {items?.map((item) => {
          const varTitle = item.variation;
          const variations = item.product_id.variations;
          const selectedVariation = item.product_id.variations.find(
            (variation) => variation.variant_title === item.variation
          );

          return (
            <Card key={item._id.toString()}>
              <CardHeader>
                <CardTitle>
                  {item.product_id.title}{" "}
                  <span className="text-sm text-gray-500">
                    ({selectedVariation?.variant_title} - Quantity: {item.qty})
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-4">
                <div className="w-24 h-24 relative">
                  <Image
                    src={`${selectedVariation?.images[0]}`}
                    alt="Product Image"
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      {item.product_id.title}
                    </span>
                    <Button
                      onClick={() => handleRemoveItem(item._id.toString()!)}
                      variant="destructive"
                      size="icon"
                    >
                      <FaTrash />
                    </Button>
                  </div>

                  <p className="text-gray-500 text-sm">
                    Variant : {selectedVariation?.variant_title}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
        <Separator />
        <div className="flex justify-between items-center mt-4">
          <p className="text-lg font-medium">Total:</p>
          <p className="text-xl font-semibold">Rp {totalAmount.toFixed(2)}</p>
        </div>
        <Button onClick={handleCheckout} className="w-full mt-4">
          Checkout
        </Button>
      </div>
    </div>
  );
};

export default CartPage;
```

## More details

1. I'm using Next.js 15, React 19, Shadcn components, react-icons/
2. I like design with this criteria

- **Modern**
- **Simple**
- **Cool**
- Have the **best UX**
- **Dark mode** using tailwind
- **Loading animation** using _Skeleton_ components from shadcn
- **Responsive** for all devices _(e.g. Mobile Phone, Tablet, and Desktop)_

3. Always refactor the code, and make it **readable for human**, and **maintainable**
4. If the function can be separated in other file **_(e.g. Function Components)_** then write it in the other file and give file route on the top of the file _(on the top of every code)_
5. Use Indonesian language

# Task

sesuaikan cart page dengan models database yang sdah aku berikan
