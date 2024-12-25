import { Cart } from "@/lib/db/models/cart.model";
import { OrderItem } from "@/lib/db/models/order-item.model";
import dbConnect from "@/lib/db/connect";
import { NextRequest, NextResponse } from "next/server";
import { PopulateOptions } from "mongoose";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const buyer_id = request.nextUrl.searchParams.get("buyer_id");

    if (!buyer_id) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const cart = await Cart.findOne({ buyer_id })
      .populate({
        path: "items",
        populate: {
          path: "product_id",
          populate: {
            path: "seller_id",
            select: "-email -hash",
          },
        },
      } as PopulateOptions)
      .populate({
        path: "buyer_id",
        select: "-email -hash",
      });

    if (!cart) {
      return NextResponse.json(
        {
          message: "Cart is empty",
          cart: null,
        },
        { status: 200 }
      );
    }

    return NextResponse.json({ cart }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { buyer_id, seller_id, product_id, variation } = await request.json();

    if (!buyer_id || !seller_id || !product_id || !variation) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    let cart = await Cart.findOne({ buyer_id });

    if (!cart) {
      // If the cart doesn't exist, create a new one
      cart = new Cart({ buyer_id, items: [] });
      await cart.save();
    }

    // Check if an item with the same product_id and variation already exists in the cart
    const existingItem = await OrderItem.findOne({
      _id: { $in: cart.items },
      product_id,
      variation,
    });

    if (existingItem) {
      // If the item exists, just increment the quantity
      existingItem.qty = (existingItem.qty || 0) + 1;
      await existingItem.save();
      return NextResponse.json(
        { message: "Item quantity updated", cart },
        { status: 200 }
      );
    } else {
      // If the item doesn't exist, create a new one
      const newItem = new OrderItem({
        product_id,
        variation,
        qty: 1, // Set initial quantity to 1
      });
      await newItem.save();

      cart.items.push(newItem.id);
      await cart.save();

      return NextResponse.json(
        { message: "Item added to cart", cart },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error("Error adding item to cart:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { item_id, cart_id } = await request.json();

    if (!item_id || !cart_id) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    const cart = await Cart.findById(cart_id)
      .populate({
        path: "items",
        populate: {
          path: "product_id",
          populate: {
            path: "seller_id",
            select: "-email -hash",
          },
        },
      } as PopulateOptions)
      .populate({
        path: "buyer_id",
        select: "-email -hash",
      });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const newItems = cart.items.filter((id) => id.toString() !== item_id);
    cart.items = newItems;
    await cart.save();
    await OrderItem.deleteOne({ _id: item_id });

    if (cart.items.length === 0) {
      // delete the cart
      await Cart.deleteOne({ _id: cart_id });
    }

    return NextResponse.json(
      { message: "Item removed successfully", cart },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    const { item_id, cart_id, variation, qty } = await request.json();

    if (!item_id || !cart_id || !(variation || qty)) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const cart = await Cart.findById(cart_id)
      .populate({
        path: "items",
        populate: {
          path: "product_id",
          populate: {
            path: "seller_id",
            select: "-email -hash",
          },
        },
      } as PopulateOptions)
      .populate({
        path: "buyer_id",
        select: "-email -hash",
      });

    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    const item = await OrderItem.findById(item_id);

    if (!item) {
      return NextResponse.json({ message: "Item not found" }, { status: 404 });
    }

    if (variation) {
      item.variation = variation;
    }

    if (qty) {
      item.qty = qty;
    }

    await item.save();

    return NextResponse.json(
      {
        message: `Item ${
          variation && qty
            ? "variation and quantity"
            : qty
            ? "quantity"
            : "variation"
        } updated successfully`,
        cart,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
