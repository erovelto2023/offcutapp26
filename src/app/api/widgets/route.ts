import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Widget from "@/models/Widget";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const WidgetCreateSchema = z.object({
  treeId: z.string(),
  widgetType: z.enum([
    "email_collection",
    "arc_reader",
    "author_book",
    "musician_tour",
    "coach_booking",
    "realtor_listing",
    "nonprofit_fundraiser",
    "gamer_stream",
    "influencer_stats",
    "artist_portfolio",
    "photographer_estimator",
    "podcaster_player",
    "youtuber_video",
    "smallbusiness_services",
    "speaker_topics",
    "teacher_resources",
    "newsletter_signup",
    "custom_html",
  ]),
  title: z.string().optional(),
  config: z.record(z.string(), z.any()).optional(),
});

const WidgetUpdateSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  isActive: z.boolean().optional(),
  order: z.number().optional(),
  config: z.record(z.string(), z.any()).optional(),
});

const ReorderSchema = z.object({
  orders: z.array(
    z.object({
      id: z.string(),
      order: z.number(),
    })
  ),
});

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const treeId = searchParams.get("treeId");

    if (!treeId) {
      return NextResponse.json({ error: "Tree ID is required" }, { status: 400 });
    }

    const widgets = await Widget.find({ treeId, isActive: true }).sort({ order: 1 });
    return NextResponse.json(widgets);
  } catch (err) {
    console.error("Widgets GET error:", err);
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
    const body = await req.json();
    const parsed = WidgetCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    // Determine order
    const lastWidget = await Widget.findOne({ treeId: parsed.data.treeId }).sort({ order: -1 });
    const nextOrder = lastWidget ? lastWidget.order + 1 : 0;

    const newWidget = await Widget.create({
      treeId: parsed.data.treeId,
      widgetType: parsed.data.widgetType,
      title: parsed.data.title || "",
      config: parsed.data.config || {},
      order: nextOrder,
      isActive: true,
    });

    return NextResponse.json(newWidget, { status: 201 });
  } catch (err) {
    console.error("Widgets POST error:", err);
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
    const body = await req.json();

    if (body.orders) {
      const parsedReorder = ReorderSchema.safeParse(body);
      if (!parsedReorder.success) {
        return NextResponse.json({ error: "Invalid reorder format" }, { status: 400 });
      }

      const bulkPromises = parsedReorder.data.orders.map((item) =>
        Widget.findByIdAndUpdate(item.id, { $set: { order: item.order } }, { new: true })
      );
      await Promise.all(bulkPromises);

      const { searchParams } = new URL(req.url);
      const treeId = searchParams.get("treeId");
      const widgets = await Widget.find({ treeId }).sort({ order: 1 });
      return NextResponse.json(widgets);
    }

    const parsedUpdate = WidgetUpdateSchema.safeParse(body);
    if (!parsedUpdate.success) {
      return NextResponse.json(
        { error: parsedUpdate.error.issues[0].message },
        { status: 400 }
      );
    }

    const { id, ...updateFields } = parsedUpdate.data;

    const updatedWidget = await Widget.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

    if (!updatedWidget) {
      return NextResponse.json({ error: "Widget not found" }, { status: 404 });
    }

    return NextResponse.json(updatedWidget);
  } catch (err) {
    console.error("Widgets PUT error:", err);
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
      return NextResponse.json({ error: "Widget ID is required" }, { status: 400 });
    }

    await dbConnect();
    await Widget.findByIdAndDelete(id);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Widgets DELETE error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
