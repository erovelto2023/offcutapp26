import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "@/models/User";
import Tree from "@/models/Tree";
import Analytics from "@/models/Analytics";
import { parseUserAgent, parseReferrer } from "@/lib/userAgent";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, treeId, referrer, utmSource, utmMedium, utmCampaign, keywords } = body;

    await dbConnect();

    let targetUserId: string | null = null;
    let targetTreeId: string | null = null;

    if (treeId) {
      const tree = await Tree.findById(treeId);
      if (tree) {
        targetUserId = tree.userId.toString();
        targetTreeId = tree._id.toString();
      }
    }

    if (!targetUserId && username) {
      // 1. Try finding a Tree by slug first
      const tree = await Tree.findOne({ slug: username.toLowerCase() });
      if (tree) {
        targetUserId = tree.userId.toString();
        targetTreeId = tree._id.toString();
      } else {
        // 2. Fallback to User by username slug
        const user = await User.findOne({ username: username.toLowerCase() });
        if (user) {
          targetUserId = user._id.toString();
        }
      }
    }

    if (!targetUserId) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Extract client metrics
    const userAgent = req.headers.get("user-agent");
    const referer = req.headers.get("referer");

    const { device, browser } = parseUserAgent(userAgent);
    const parsedReferrer = parseReferrer(referer);

    // Log Page View Analytics
    await Analytics.create({
      userId: targetUserId,
      treeId: targetTreeId,
      linkId: null,
      type: "view",
      referrer: referrer || parsedReferrer,
      utmSource: utmSource || "",
      utmMedium: utmMedium || "",
      utmCampaign: utmCampaign || "",
      keywords: keywords || "",
      device,
      browser,
    });

    return NextResponse.json({ success: true, message: "Page view logged successfully" });
  } catch (err) {
    console.error("Page View Analytics Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
