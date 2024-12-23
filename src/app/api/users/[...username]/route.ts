import dbConnect from "@/lib/db/connect";
import { IUser, IUserDoc, User } from "@/lib/db/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { Product } from "@/lib/db/models/product.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";

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
    const body = (await req.json()) as IUser;

    if (!userName) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const { kelas: kelasnokelas } = body;

    const updateData = { ...body };
    if (kelasnokelas) {
      const [, kelas, nomor_kelas] = kelasnokelas.match(/([\w-]+)(\d)/) || [];
      updateData.kelas = kelas;
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

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ username: string[] }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const [targetUsername, method] = (await params).username;

    if (!targetUsername) {
      return NextResponse.json(
        { message: "Target username is required" },
        { status: 400 }
      );
    }

    if (method === "follow") {
      if (targetUsername === session.user.username) {
        return NextResponse.json(
          { message: "You cannot follow yourself" },
          { status: 400 }
        );
      }
      await dbConnect();
      const targetUser = await User.findOne({ username: targetUsername });
      if (!targetUser) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }
      const userFollower = await User.findOne({
        username: session.user.username,
      });
      if (!userFollower) {
        return NextResponse.json(
          { message: "Current user not found" },
          { status: 404 }
        );
      }

      const isFollowing = targetUser.followers.some((follower) => {
        return follower.toString() === userFollower.id;
      });

      let updateduserFollower: IUserDoc | null;
      if (isFollowing) {
        updateduserFollower = await targetUser.updateOne(
          { $pull: { followers: userFollower.id } },
          { new: true }
        );

        if (!updateduserFollower) {
          return NextResponse.json(
            { message: "Error unfollowing user" },
            { status: 500 }
          );
        }
      } else {
        updateduserFollower = await targetUser.updateOne(
          { $push: { followers: userFollower.id } },
          { new: true }
        );

        if (!updateduserFollower) {
          return NextResponse.json(
            { message: "Error following user" },
            { status: 500 }
          );
        }
      }

      const user = await User.findOne(
        { username: targetUsername },
        { hash: 0, email: 0 }
      );
      return NextResponse.json(
        { followed: !isFollowing, data: user },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("Error following/unfollowing user:", error);
    return NextResponse.json(
      { message: `Failed to follow/unfollow user: ${error.message}` },
      { status: 500 }
    );
  }
}
