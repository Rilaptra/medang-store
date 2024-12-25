import dbConnect from "@/lib/db/connect";
import { IProduct, Product } from "@/lib/db/models/product.model";
import { IUser } from "@/lib/db/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string; productTitle: string }> }
) {
  try {
    await dbConnect();
    const theparams = await params;
    const product = await Product.find({ title: theparams.productTitle });
    return NextResponse.json(
      { theparams, msg: "ok", product },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
