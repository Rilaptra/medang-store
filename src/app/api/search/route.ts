import dbConnect from "@/lib/db/connect";
import { Product } from "@/lib/db/models/product.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const query = req.nextUrl.searchParams.get("query"); // Get query parameter
    const category = req.nextUrl.searchParams.get("category"); //Get the category param

    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "10", 10);
    const skip = (page - 1) * limit;

    const filters = {
      isActive: true,
      ...(query &&
        query !== "null" && {
          // Check if query is not empty and not null
          $or: [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } },
            { "variations.variant_title": { $regex: query, $options: "i" } },
          ],
        }),
      ...(category &&
        category !== "null" && {
          category: { $regex: category, $options: "i" },
        }), //Check if category is not empty and not null
    };

    const products = await Product.find(filters)
      .skip(skip)
      .limit(limit)
      .sort({ created_at: -1 });

    const totalProducts = await Product.countDocuments(filters);
    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json(
      {
        data: products,
        currentPage: page,
        totalPages,
        totalProducts,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
