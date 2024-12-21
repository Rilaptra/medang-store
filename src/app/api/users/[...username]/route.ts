import dbConnect from "@/lib/db/connect";
import { IUser, User } from "@/lib/db/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/lib/db/models/product.model";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string[] }> }
) {
  try {
    const [username] = (await params).username;
    if (!username) {
      return NextResponse.json(
        { message: "Username is required" },
        { status: 400 }
      );
    }
    await dbConnect();
    const user = await User.findOne(
      { username: username },
      { hash: 0, email: 0 }
    );
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const url = new URL(req.url);
    const fetchProducts = url.searchParams.get("fetchProducts") === "true";

    let products = null;
    if (fetchProducts && user.role === "seller") {
      products = await Product.find({ seller_id: user._id });
    }

    return NextResponse.json(
      { data: { user, products: fetchProducts ? products : undefined } },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ username: string[] }> }
) {
  try {
    await dbConnect();
    const [userName] = (await params).username;
    const body = await req.json();

    if (!userName) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const {
      role,
      verified,
      profile_picture,
      kelas,
      bio,
      website_sosmed_link,
      username,
      name,
      phone_number,
      nomor_kelas,
    } = body;

    const updateData: Partial<IUser> = {};
    if (role) {
      updateData.role = role;
    }
    if (verified !== undefined) {
      updateData.verified = verified;
    }
    if (profile_picture) {
      updateData.profile_picture = profile_picture;
    }
    if (kelas) {
      updateData.kelas = kelas;
    }
    if (bio) {
      updateData.bio = bio;
    }
    if (website_sosmed_link) {
      updateData.website_sosmed_link = website_sosmed_link;
    }
    if (username) {
      updateData.username = username;
    }
    if (name) {
      updateData.name = name;
    }
    if (phone_number) {
      updateData.phone_number = phone_number;
    }
    if (nomor_kelas) {
      updateData.nomor_kelas = nomor_kelas;
    }

    const updatedUser = await User.findOneAndUpdate(
      { username: userName },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User updated successfully", data: updatedUser },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: `Failed to update user: ${error.message}` },
      { status: 500 }
    );
  }
}
