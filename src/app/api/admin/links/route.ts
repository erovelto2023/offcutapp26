import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Link from "@/models/Link";
import Tree from "@/models/Tree";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const LinkCreateSchema = z.object({
  title: z.string().trim().min(1, "Link title is required").max(60, "Link title must not exceed 60 characters"),
  url: z
    .string()
    .trim()
    .min(1, "Destination URL is required")
    .refine((val) => {
      try {
        const u = new URL(val);
        return u.protocol === "http:" || u.protocol === "https:";
      } catch {
        return false;
      }
    }, "Must be a valid web link starting with http:// or https://"),
  icon: z.string().trim().max(50).optional().default(""),
  animationStyle: z.enum(["none", "pulse", "bounce", "shine"]).optional().default("none"),
  tab: z.string().optional().default(""),
});

const LinkUpdateSchema = z.object({
  id: z.string(),
  title: z.string().trim().min(1, "Link title is required").max(60, "Link title must not exceed 60 characters").optional(),
  url: z
    .string()
    .trim()
    .refine((val) => {
      try {
        const u = new URL(val);
        return u.protocol === "http:" || u.protocol === "https:";
      } catch {
        return false;
      }
    }, "Must be a valid web link starting with http:// or https://")
    .optional(),
  icon: z.string().trim().max(50).optional(),
  isActive: z.boolean().optional(),
  animationStyle: z.enum(["none", "pulse", "bounce", "shine"]).optional(),
  tab: z.string().optional(),
});

const ReorderSchema = z.object({
  orders: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
    })
  ),
});

// Utility to resolve tree target
async function getTreeTarget(userId: string, slug?: string | null) {
  if (!slug) return null;
  return Tree.findOne({ slug, userId });
}

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const tree = await getTreeTarget(session.userId, slug);

    const query: Record<string, any> = { userId: session.userId };
    if (tree) {
      query.treeId = tree._id;
    } else if (slug) {
      return NextResponse.json({ error: "Tree not found" }, { status: 404 });
    } else {
      // Fallback for legacy
      query.treeId = { $exists: false };
    }

    const links = await Link.find(query).sort({ order: 1 });
    return NextResponse.json(links);
  } catch (err) {
    console.error("Links GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const tree = await getTreeTarget(session.userId, slug);

    if (slug && !tree) {
      return NextResponse.json({ error: "Tree not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = LinkCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // Determine order
    const countQuery: Record<string, any> = { userId: session.userId };
    if (tree) countQuery.treeId = tree._id;
    else countQuery.treeId = { $exists: false };

    const lastLink = await Link.findOne(countQuery).sort({ order: -1 });
    const nextOrder = lastLink ? lastLink.order + 1 : 0;

    const newLink = await Link.create({
      userId: session.userId,
      treeId: tree ? tree._id : null,
      title: parsed.data.title,
      url: parsed.data.url,
      icon: parsed.data.icon,
      animationStyle: parsed.data.animationStyle || "none",
      tab: parsed.data.tab || "",
      order: nextOrder,
      isActive: true,
      clicksCount: 0,
    });

    return NextResponse.json(newLink, { status: 201 });
  } catch (err) {
    console.error("Links POST error:", err);
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
    const tree = await getTreeTarget(session.userId, slug);

    if (slug && !tree) {
      return NextResponse.json({ error: "Tree not found" }, { status: 404 });
    }

    const body = await req.json();

    if (body.orders) {
      const parsedReorder = ReorderSchema.safeParse(body);
      if (!parsedReorder.success) {
        return NextResponse.json({ error: "Invalid reorder format" }, { status: 400 });
      }

      const bulkPromises = parsedReorder.data.orders.map((item) =>
        Link.findOneAndUpdate(
          { _id: item.id, userId: session.userId },
          { $set: { order: item.order } },
          { new: true }
        )
      );
      await Promise.all(bulkPromises);

      const countQuery: Record<string, any> = { userId: session.userId };
      if (tree) countQuery.treeId = tree._id;
      else countQuery.treeId = { $exists: false };

      const links = await Link.find(countQuery).sort({ order: 1 });
      return NextResponse.json(links);
    }

    const parsedUpdate = LinkUpdateSchema.safeParse(body);
    if (!parsedUpdate.success) {
      return NextResponse.json(
        { error: parsedUpdate.error.issues[0].message },
        { status: 400 }
      );
    }

    const { id, ...updateFields } = parsedUpdate.data;

    const updatedLink = await Link.findOneAndUpdate(
      { _id: id, userId: session.userId },
      { $set: updateFields },
      { new: true }
    );

    if (!updatedLink) {
      return NextResponse.json({ error: "Link not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json(updatedLink);
  } catch (err) {
    console.error("Links PUT error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing link id parameter" }, { status: 400 });
    }

    await dbConnect();
    const deletedLink = await Link.findOneAndDelete({ _id: id, userId: session.userId });

    if (!deletedLink) {
      return NextResponse.json({ error: "Link not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Link deleted successfully" });
  } catch (err) {
    console.error("Links DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
