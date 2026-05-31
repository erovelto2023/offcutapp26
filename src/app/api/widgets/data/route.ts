import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import WidgetData from "@/models/WidgetData";
import Widget from "@/models/Widget";
import Tree from "@/models/Tree";
import User from "@/models/User";
import { getSession } from "@/lib/auth";
import { z } from "zod";

const WidgetDataCreateSchema = z.object({
  widgetId: z.string(),
  treeId: z.string(),
  dataType: z.enum(["email", "form_submission", "booking_request", "donation", "inquiry", "custom"]),
  data: z.record(z.string(), z.any()),
});

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const parsed = WidgetDataCreateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { widgetId, treeId, dataType, data } = parsed.data;

    // Verify widget exists
    const widget = await Widget.findById(widgetId);
    if (!widget) {
      return NextResponse.json({ error: "Widget not found" }, { status: 404 });
    }

    // Verify tree exists and get userId
    const tree = await Tree.findById(treeId);
    if (!tree) {
      return NextResponse.json({ error: "Tree not found" }, { status: 404 });
    }

    // Extract metadata from request
    const userAgent = req.headers.get("user-agent") || "";
    const referer = req.headers.get("referer") || "";
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";

    // Create widget data entry
    const widgetData = await WidgetData.create({
      widgetId,
      treeId,
      userId: tree.userId,
      dataType,
      data,
      metadata: {
        ip,
        userAgent,
        referrer: referer,
      },
    });

    return NextResponse.json({ success: true, id: widgetData._id }, { status: 201 });
  } catch (err) {
    console.error("Widget Data POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const treeId = searchParams.get("treeId");
    const dataType = searchParams.get("dataType");
    const widgetId = searchParams.get("widgetId");

    if (!treeId) {
      return NextResponse.json({ error: "Tree ID is required" }, { status: 400 });
    }

    // Verify user owns the tree
    const tree = await Tree.findById(treeId);
    if (!tree || tree.userId.toString() !== session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const query: Record<string, any> = { treeId };
    if (dataType) query.dataType = dataType;
    if (widgetId) query.widgetId = widgetId;

    const widgetData = await WidgetData.find(query)
      .sort({ createdAt: -1 })
      .limit(100);

    return NextResponse.json(widgetData);
  } catch (err) {
    console.error("Widget Data GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
