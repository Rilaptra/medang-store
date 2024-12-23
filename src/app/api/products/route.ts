// src/app/api/products/route.ts

import dbConnect from "@/lib/db/connect";
import { Product } from "@/lib/db/models/product.model";
import { PopulateOptions } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const query = req.nextUrl.searchParams.get("id");
    await dbConnect();
    if (!query) {
      const products = await Product.find().populate({
        path: "seller_id",
        select: "username name profile_picture",
      } as PopulateOptions);
      if (!products)
        return NextResponse.json(
          { message: "Products not found" },
          { status: 404 }
        );
      return NextResponse.json({ data: products }, { status: 200 });
    }

    const products = await Product.findById(query).populate({
      path: "seller_id",
      select: "username name profile_picture",
    } as PopulateOptions);
    if (!products)
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );

    return NextResponse.json({ data: products }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
