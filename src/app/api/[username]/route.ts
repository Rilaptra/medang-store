import dbConnect from "@/lib/db/connect";
import { User } from "@/lib/db/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    await dbConnect();
    const param = (await params).username;
    if (!param)
      return NextResponse.json(
        { message: "Identifier required" },
        { status: 400 }
      );

    switch (param) {
      case "login":
        const username = req.nextUrl.searchParams.get("username");
        if (!username) {
          return NextResponse.json(
            { message: "Username required" },
            { status: 400 }
          );
        }
        const user = await User.findOne({ username });
        if (!user)
          return NextResponse.json(
            { message: "User not found" },
            { status: 404 }
          );
        return NextResponse.json({ user }, { status: 200 });
        break;

      default:
        console.log(`[ERROR] Unknown request "${req.nextUrl.pathname}"`);
        return NextResponse.json(
          { message: "Unknown request", param },
          { status: 400 }
        );
        break;
    }
  } catch (error: any) {
    console.log(`[ERROR] ${error}`);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
