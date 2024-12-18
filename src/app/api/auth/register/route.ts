import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import connectDB from "@/lib/db/connect";
import { User } from "@/lib/db/models/user.model";

export async function POST(req: Request) {
  try {
    const { username, email, password, name } = await req.json();

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 12);

    const user = await User.create({
      username,
      email,
      hash: hashedPassword,
      name,
      role: "member",
    });

    return NextResponse.json(
      { message: "User created successfully", userId: user._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}
