import dbConnect from "@/lib/db/connect";
import { User } from "@/lib/db/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  try {
    await dbConnect();
    const users = await User.find({});
    return NextResponse.json({ data: users }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: `Failed to fetch users: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const { userId, role, verified } = await req.json();

    console.log(userId, role, verified);

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const updateData: {
      role?: "member" | "admin" | "seller";
      verified?: boolean;
    } = {};
    if (role) {
      updateData.role = role;
      if (role === "member") {
        updateData.verified = false;
      } else if (role === "seller") {
        updateData.verified = true;
      }
    }
    if (typeof verified === "boolean") {
      updateData.verified = verified;
      updateData.role =
        verified && role === "member"
          ? "seller"
          : !verified && role === "seller"
          ? "member"
          : updateData.role;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User updated successfully", user: updatedUser },
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

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    const { userId }: { userId?: string } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { message: `Failed to delete user: ${error.message}` },
      { status: 500 }
    );
  }
}
