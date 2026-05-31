import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { comparePasswords, setSessionCookie } from "@/lib/auth";
import { z } from "zod";

const LoginSchema = z.object({
  username: z.string().trim().toLowerCase(),
  password: z.string(),
  isAdminPortal: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid username or password format" },
        { status: 400 }
      );
    }

    const { username, password, isAdminPortal } = parsed.data;

    // 1. Fetch user by username
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Strict Security Isolation between Admin and User logins
    if (isAdminPortal) {
      if (user.role !== "admin") {
        return NextResponse.json(
          { error: "Access Denied: Standard creator accounts cannot log in via the Admin portal." },
          { status: 403 }
        );
      }
    } else {
      if (user.role === "admin") {
        return NextResponse.json(
          { error: "Security Restriction: Site Administrators must log in through the designated Admin Portal." },
          { status: 403 }
        );
      }
    }

    // 2. Validate password
    const isMatch = await comparePasswords(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // 3. Set cookie session
    await setSessionCookie({
      userId: user._id.toString(),
      username: user.username,
      role: user.role || "member",
    });

    return NextResponse.json({
      success: true,
      username: user.username,
      name: user.name,
      role: user.role || "member",
    });
  } catch (err) {
    console.error("Login Error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred during login" },
      { status: 500 }
    );
  }
}
