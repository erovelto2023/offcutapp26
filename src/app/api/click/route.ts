import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Link from "@/models/Link";
import Analytics from "@/models/Analytics";
import { parseUserAgent, parseReferrer } from "@/lib/userAgent";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const linkId = searchParams.get("id");

    if (!linkId) {
      return new Response("Missing link ID", { status: 400 });
    }

    await dbConnect();

    // 1. Fetch Link Details
    const link = await Link.findById(linkId);
    if (!link || !link.isActive) {
      return new Response("Link not found or inactive", { status: 404 });
    }

    const referrerParam = searchParams.get("ref");
    const keywordsParam = searchParams.get("kw");
    const utmSourceParam = searchParams.get("utm_source");
    const utmMediumParam = searchParams.get("utm_medium");
    const utmCampaignParam = searchParams.get("utm_campaign");

    // 2. Extract Client Metadata
    const userAgent = req.headers.get("user-agent");
    const referer = req.headers.get("referer");

    const { device, browser } = parseUserAgent(userAgent);
    const parsedReferrer = parseReferrer(referer);

    // 3. Log Analytics Event with associated treeId
    Analytics.create({
      userId: link.userId,
      treeId: link.treeId || null,
      linkId: link._id,
      type: "click",
      referrer: referrerParam || parsedReferrer,
      keywords: keywordsParam || "",
      utmSource: utmSourceParam || "",
      utmMedium: utmMediumParam || "",
      utmCampaign: utmCampaignParam || "",
      device,
      browser,
    }).catch((err) => console.error("Failed to write click analytics log:", err));

    // 4. Increment cached clicks count
    Link.findByIdAndUpdate(linkId, { $inc: { clicksCount: 1 } }).catch((err) =>
      console.error("Failed to increment cached clicks count:", err)
    );

    // 5. Hardened Protocol Validation and Redirection
    let destinationUrl = link.url.trim();
    if (!destinationUrl.startsWith("http://") && !destinationUrl.startsWith("https://")) {
      destinationUrl = `https://${destinationUrl}`;
    }

    return NextResponse.redirect(new URL(destinationUrl));
  } catch (err) {
    console.error("Redirection Error:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
