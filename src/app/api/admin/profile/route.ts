import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Tree from "@/models/Tree";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const ThemeSettingsSchema = z.object({
  themeType: z.enum(["preset", "custom"]).default("preset"),
  backgroundType: z.enum(["solid", "gradient", "image"]).default("gradient"),
  backgroundColor: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color code").default("#09090b"),
  backgroundGradientStart: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color code").default("#0f172a"),
  backgroundGradientEnd: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color code").default("#1e1b4b"),
  backgroundImageUrl: z.string().trim().max(1000).optional().default(""),
  fontFamily: z.enum(["sans", "serif", "mono", "display"]).default("sans"),
  cardStyle: z.enum(["glassmorphic", "flat", "outline", "neon"]).default("glassmorphic"),
  cardRoundness: z.enum(["rounded-none", "rounded-xl", "rounded-full"]).default("rounded-xl"),
  textColor: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color code").default("#ffffff"),
  accentColor: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color code").default("#8b5cf6"),
  buttonColor: z.string().trim().regex(/^$|^#[0-9a-fA-F]{6}$/, "Invalid color code").optional().default(""),
});

const ProfileUpdateSchema = z.object({
  name: z.string().trim().max(40, "Display name cannot exceed 40 characters"),
  bio: z.string().trim().max(160, "Bio cannot exceed 160 characters"),
  avatarUrl: z.string().trim().max(500).optional(),
  theme: z.enum(["midnight", "sunset", "cyberpunk", "emerald"]),
  themeSettings: ThemeSettingsSchema.optional(),
  socials: z.object({
    twitter: z.string().trim().max(100).optional().default(""),
    instagram: z.string().trim().max(100).optional().default(""),
    github: z.string().trim().max(100).optional().default(""),
    youtube: z.string().trim().max(100).optional().default(""),
    linkedin: z.string().trim().max(100).optional().default(""),
    tiktok: z.string().trim().max(100).optional().default(""),
    email: z.string().trim().max(100).optional().default(""),
    phone: z.string().trim().max(100).optional().default(""),
  }),
  tabs: z.array(z.string()).optional(),
  nicheSettings: z.record(z.string(), z.any()).optional(),
});

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const tree = await Tree.findOne({ slug, userId: session.userId });
      if (!tree) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }
      return NextResponse.json(tree);
    }

    // Fallback to legacy User document if no slug
    const user = await User.findById(session.userId).select("-password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (err) {
    console.error("Profile GET Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const body = await req.json();

    const parsed = ProfileUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    if (slug) {
      const updatedTree = await Tree.findOneAndUpdate(
        { slug, userId: session.userId },
        {
          $set: {
            name: parsed.data.name,
            bio: parsed.data.bio,
            avatarUrl: parsed.data.avatarUrl || "",
            theme: parsed.data.theme,
            themeSettings: parsed.data.themeSettings,
            socials: parsed.data.socials,
            tabs: parsed.data.tabs || [],
            nicheSettings: parsed.data.nicheSettings || {},
          },
        },
        { new: true }
      );
      if (!updatedTree) {
        return NextResponse.json({ error: "Profile not found" }, { status: 404 });
      }
      return NextResponse.json(updatedTree);
    }

    // Fallback to User update
    const updatedUser = await User.findByIdAndUpdate(
      session.userId,
      {
        $set: {
          name: parsed.data.name,
          bio: parsed.data.bio,
          avatarUrl: parsed.data.avatarUrl || "",
          theme: parsed.data.theme,
          themeSettings: parsed.data.themeSettings,
          socials: parsed.data.socials,
          tabs: parsed.data.tabs || [],
          nicheSettings: parsed.data.nicheSettings || {},
        },
      },
      { new: true }
    ).select("-password");

    return NextResponse.json(updatedUser);
  } catch (err) {
    console.error("Profile PUT Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
