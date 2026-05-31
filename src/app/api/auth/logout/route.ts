import { NextResponse } from "next/server";
import { deleteSessionCookie } from "@/lib/auth";

export async function POST() {
  try {
    await deleteSessionCookie();
    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout Error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred during logout" },
      { status: 500 }
    );
  }
}
export async function GET() {
  // Support GET logout redirection
  try {
    await deleteSessionCookie();
    return NextResponse.redirect(new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  } catch {
    return NextResponse.redirect(new URL("/login", "http://localhost:3000"));
  }
}
