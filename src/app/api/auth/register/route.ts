import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import connectDB from "@/lib/db/connect";
import { IUser, User } from "@/lib/db/models/user.model";

interface RegisterData extends Partial<IUser> {
  password?: string;
}
export async function POST(req: Request) {
  try {
    const {
      username,
      email,
      password,
      name,
      bio,
      phone_number,
      website_sosmed_link,
      kelas: kelasnokelas,
    } = (await req.json()) as RegisterData;

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
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
    let kelas;
    let nomor_kelas;
    if (kelasnokelas) {
      [, kelas, nomor_kelas] = kelasnokelas.match(/([\w-]+)(\d)/);
    }

    const user = await User.create({
      username,
      email,
      hash: hashedPassword,
      name,
      role: "member",
      kelas,
      nomor_kelas,
      bio,
      phone_number,
      website_sosmed_link,
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
