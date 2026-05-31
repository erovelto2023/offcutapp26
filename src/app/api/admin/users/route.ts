import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import User from "@/models/User";
import Tree from "@/models/Tree";
import Link from "@/models/Link";
import Analytics from "@/models/Analytics";

// Helper to enforce global admin role
async function verifyAdminAuth() {
  const session = await getSession();
  if (!session || !session.userId) {
    return null;
  }

  await dbConnect();
  const user = await User.findById(session.userId);
  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}

export async function GET() {
  try {
    const admin = await verifyAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Access Denied: Admins Only" }, { status: 403 });
    }

    // 1. Fetch all users
    const dbUsers = await User.find({}).select("-password").sort({ createdAt: -1 });

    // 2. Count trees for each user
    const usersWithTreesCount = await Promise.all(
      dbUsers.map(async (u) => {
        const treesCount = await Tree.countDocuments({ userId: u._id });
        return {
          ...u.toObject(),
          treesCount,
        };
      })
    );

    // 3. Aggregate global site statistics
    const totalUsers = dbUsers.length;
    const totalTrees = await Tree.countDocuments({});
    const totalViews = await Analytics.countDocuments({ type: "view" });
    const totalClicks = await Analytics.countDocuments({ type: "click" });

    return NextResponse.json({
      users: usersWithTreesCount,
      stats: {
        totalUsers,
        totalTrees,
        totalViews,
        totalClicks,
      },
    });
  } catch (err) {
    console.error("GET Admin Users Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const admin = await verifyAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Access Denied: Admins Only" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing User ID parameter" }, { status: 400 });
    }

    const { username, name, bio, role } = await req.json();

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Avoid lock-out / renaming root admin
    if (targetUser.username === "admin" && (username !== "admin" || role !== "admin")) {
      return NextResponse.json({ error: "Security Override: Cannot modify root admin username or role" }, { status: 400 });
    }

    // Verify duplicate username if changed
    if (username && username.trim().toLowerCase() !== targetUser.username) {
      const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");
      const duplicate = await User.findOne({ username: cleanUsername });
      if (duplicate) {
        return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
      }
      targetUser.username = cleanUsername;
    }

    if (name !== undefined) targetUser.name = name;
    if (bio !== undefined) targetUser.bio = bio;
    if (role !== undefined) targetUser.role = role;

    await targetUser.save();

    return NextResponse.json({ success: true, user: targetUser });
  } catch (err) {
    console.error("PUT Admin Users Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = await verifyAdminAuth();
    if (!admin) {
      return NextResponse.json({ error: "Access Denied: Admins Only" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing User ID parameter" }, { status: 400 });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent deleting root admin
    if (targetUser.username === "admin") {
      return NextResponse.json({ error: "Security Override: Cannot delete root admin account" }, { status: 400 });
    }

    // Completely purge User from DB and all associated entities
    await Link.deleteMany({ userId: targetUser._id });
    await Analytics.deleteMany({ userId: targetUser._id });
    await Tree.deleteMany({ userId: targetUser._id });
    await User.deleteOne({ _id: targetUser._id });

    return NextResponse.json({ success: true, message: "User account fully purged." });
  } catch (err) {
    console.error("DELETE Admin Users Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
