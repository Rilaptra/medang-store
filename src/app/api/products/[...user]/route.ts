// src/app/api/products/[...user]/route.ts

import dbConnect from "@/lib/db/connect";
import { IProduct, Product } from "@/lib/db/models/product.model";
import { IUser } from "@/lib/db/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ user: string[] }> }
) {
  try {
    await dbConnect();
    const [user, productTitle] = (await params).user;
    if (!user) {
      return NextResponse.json(
        { message: "User is required" },
        { status: 400 }
      );
    }

    if (productTitle) {
      const product = await Product.find({
        title: new RegExp(`^${productTitle}$`, "i"),
      }).populate("seller_id");

      if (!product)
        return NextResponse.json(
          { message: "Product not found" },
          { status: 404 }
        );

      const selectedProduct = product.find(
        (p) => (p.seller_id as unknown as IUser).username === user
      );
      if (!selectedProduct)
        return NextResponse.json(
          { message: "Product not found" },
          { status: 404 }
        );
      return NextResponse.json({ data: selectedProduct }, { status: 200 });
    }
    const products = await Product.find({ seller_id: user });
    return NextResponse.json({ data: products }, { status: 200 });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ user: string[] }> }
) {
  try {
    await dbConnect();
    const [user] = (await params).user;
    if (!user) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }
    const body = (await req.json()) as IProduct;
    const { seller_id, title, description, category, variations } = body;

    if (
      !seller_id ||
      !title ||
      !description ||
      !category ||
      !variations ||
      variations.length === 0
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    const product = await Product.create(body);
    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error: any) {
    console.error(error); // Log the full error
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ user: string[] }> }
) {
  try {
    await dbConnect();
    const [productId] = (await params).user;
    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const body = (await req.json()) as IProduct;

    const updatedProduct = await Product.findByIdAndUpdate(productId, body, {
      new: true,
    });

    if (!updatedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ data: updatedProduct }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ user: string[] }> }
) {
  try {
    await dbConnect();
    const [productId] = (await params).user;

    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
