import dbConnect from "@/lib/db/connect";
import { IUser, User } from "@/lib/db/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { authOptions, validation } from "../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const session = await validation();
    const { id } = session.user;
    const user = await User.findById(id);
    return NextResponse.json({ data: user }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: `Failed to fetch user: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id: userId } = session.user;
    const body = await req.json();

    if (!userId) {
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

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

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
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ route: string[] }> }
) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id: userId } = session.user;

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
