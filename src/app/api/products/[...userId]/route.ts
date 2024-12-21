import { IProduct, Product } from "@/lib/db/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string[] }> }
) {
  try {
    const [userId] = (await params).userId;
    if (!userId)
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    const products = await Product.find({ seller_id: userId });
    if (!products)
      return NextResponse.json(
        { message: "Products not found" },
        { status: 404 }
      );
    return NextResponse.json({ data: products }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string[] }> }
) {
  try {
    const [userId] = (await params).userId;
    if (!userId)
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    const body = (await req.json()) as Partial<IProduct>;
    const { seller_id, title, description, price, category } = body;
    if (!seller_id || !title || !description || !price || !category)
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );

    const product = await Product.create(body);
    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
