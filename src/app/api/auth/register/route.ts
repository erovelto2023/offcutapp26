import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword, setSessionCookie } from "@/lib/auth";
import { z } from "zod";

const RegisterSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must not exceed 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    // 1. Zod input validation
    const parsed = RegisterSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;
    const lowerUsername = username.toLowerCase();

    // 2. Reserved handles check (block static routes from being hijacked)
    const reservedUsernames = ["admin", "login", "register", "api", "dashboard", "settings", "theme", "click", "view"];
    if (reservedUsernames.includes(lowerUsername)) {
      return NextResponse.json(
        { error: "This username is reserved and cannot be registered" },
        { status: 400 }
      );
    }

    // 3. Duplicate check
    const existingUser = await User.findOne({ username: lowerUsername });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username is already claimed" },
        { status: 400 }
      );
    }

    // 4. Hash password
    const hashedPassword = await hashPassword(password);

    // 5. Create user profile
    const user = await User.create({
      username: lowerUsername,
      password: hashedPassword,
      name: username, // default to original display case
      bio: `Welcome to my Offcut Links!`,
      theme: "midnight",
      role: "member",
    });

    // Create the default linktree for this user
    const Tree = (await import("@/models/Tree")).default;
    await Tree.create({
      userId: user._id,
      slug: lowerUsername,
      type: "default",
      name: username,
      bio: `Welcome to my Offcut Links!`,
      theme: "midnight",
    });

    // 6. Set HTTP-only session cookie
    await setSessionCookie({
      userId: user._id.toString(),
      username: user.username,
      role: "member",
    });

    return NextResponse.json({
      success: true,
      username: user.username,
      name: user.name,
      role: "member",
    });
  } catch (err) {
    console.error("Register Error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred during registration" },
      { status: 500 }
    );
  }
}
