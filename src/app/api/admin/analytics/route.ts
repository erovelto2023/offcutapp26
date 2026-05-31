import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import Analytics from "@/models/Analytics";
import Link from "@/models/Link";
import Tree from "@/models/Tree";
import { getSession } from "@/lib/auth";
import mongoose from "mongoose";

export async function GET(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const userId = session.userId;
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const tree = slug ? await Tree.findOne({ slug, userId }) : null;

    if (slug && !tree) {
      return NextResponse.json({ error: "Tree not found" }, { status: 404 });
    }

    // Dynamic scoping queries
    const overviewQuery: Record<string, any> = { userId };
    const linkQuery: Record<string, any> = { userId };
    let matchStage: any = { userId: new mongoose.Types.ObjectId(userId) };

    if (tree) {
      overviewQuery.treeId = tree._id;
      linkQuery.treeId = tree._id;
      matchStage.treeId = tree._id;
    } else {
      overviewQuery.treeId = { $exists: false };
      linkQuery.treeId = { $exists: false };
      matchStage.treeId = { $exists: false };
    }

    // 1. Calculate General Overview Counters
    const totalViews = await Analytics.countDocuments({ ...overviewQuery, type: "view" });
    const totalClicks = await Analytics.countDocuments({ ...overviewQuery, type: "click" });
    const ctr = totalViews > 0 ? parseFloat(((totalClicks / totalViews) * 100).toFixed(1)) : 0;

    // 2. Fetch Link Click Breakdown
    const linksBreakdown = await Link.find(linkQuery)
      .select("title url clicksCount isActive")
      .sort({ clicksCount: -1 });

    // 3. Time Series Data (Daily Breakdown for the last 7 Days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    matchStage.timestamp = { $gte: sevenDaysAgo };

    const timeSeriesAggregation = await Analytics.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            day: { $dayOfMonth: "$timestamp" },
            month: { $month: "$timestamp" },
            year: { $year: "$timestamp" },
            type: "$type",
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
          "_id.day": 1,
        },
      },
    ]);

    // Format timeseries data for the frontend charts
    const dailyMap: { [key: string]: { date: string; views: number; clicks: number } } = {};
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
      dailyMap[key] = { date: dateStr, views: 0, clicks: 0 };
    }

    timeSeriesAggregation.forEach((item) => {
      const year = item._id.year;
      const month = String(item._id.month).padStart(2, "0");
      const day = String(item._id.day).padStart(2, "0");
      const key = `${year}-${month}-${day}`;
      const typeKey = item._id.type === "view" ? "views" : "clicks";
      
      if (dailyMap[key]) {
        dailyMap[key][typeKey] = item.count;
      }
    });

    const timeSeriesData = Object.values(dailyMap).reverse();

    // 4. Referrers Pie Breakdown
    const referrersMatchStage = { ...matchStage, type: "click" };
    delete referrersMatchStage.timestamp; // We want all time referrers, but scoped to the tree
    const referrersAggregation = await Analytics.aggregate([
      { $match: referrersMatchStage },
      { $group: { _id: "$referrer", value: { $sum: 1 } } },
      { $sort: { value: -1 } },
      { $limit: 6 },
    ]);
    const referrersData = referrersAggregation.map((item) => ({
      name: item._id || "Direct",
      value: item.value,
    }));

    // 5. Devices Breakdown
    const devicesMatchStage = { ...matchStage };
    delete devicesMatchStage.timestamp;
    const devicesAggregation = await Analytics.aggregate([
      { $match: devicesMatchStage },
      { $group: { _id: "$device", value: { $sum: 1 } } },
      { $sort: { value: -1 } },
    ]);
    const devicesData = devicesAggregation.map((item) => ({
      name: item._id || "unknown",
      value: item.value,
    }));

    // 6. Browsers Breakdown
    const browsersMatchStage = { ...matchStage };
    delete browsersMatchStage.timestamp;
    const browsersAggregation = await Analytics.aggregate([
      { $match: browsersMatchStage },
      { $group: { _id: "$browser", value: { $sum: 1 } } },
      { $sort: { value: -1 } },
      { $limit: 5 },
    ]);
    const browsersData = browsersAggregation.map((item) => ({
      name: item._id || "unknown",
      value: item.value,
    }));

    // 7. Top Search Keywords Leaderboard
    const keywordsMatchStage = { ...matchStage, keywords: { $ne: "" } };
    delete keywordsMatchStage.timestamp;
    const keywordsAggregation = await Analytics.aggregate([
      { $match: keywordsMatchStage },
      { $group: { _id: "$keywords", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    const keywordsData = keywordsAggregation.map((item) => ({
      keyword: item._id,
      count: item.count,
    }));

    // 8. Top UTM Campaigns Breakdown
    const utmMatchStage = { ...matchStage, utmCampaign: { $ne: "" } };
    delete utmMatchStage.timestamp;
    const utmCampaignsAggregation = await Analytics.aggregate([
      { $match: utmMatchStage },
      {
        $group: {
          _id: {
            campaign: "$utmCampaign",
            source: "$utmSource",
            medium: "$utmMedium",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    const utmCampaignsData = utmCampaignsAggregation.map((item) => ({
      campaign: item._id.campaign,
      source: item._id.source,
      medium: item._id.medium,
      count: item.count,
    }));

    return NextResponse.json({
      overview: {
        views: totalViews,
        clicks: totalClicks,
        ctr,
      },
      timeSeries: timeSeriesData,
      links: linksBreakdown,
      referrers: referrersData.length ? referrersData : [{ name: "No data", value: 1 }],
      devices: devicesData.length ? devicesData : [{ name: "No data", value: 1 }],
      browsers: browsersData.length ? browsersData : [{ name: "No data", value: 1 }],
      keywords: keywordsData,
      utmCampaigns: utmCampaignsData,
    });
  } catch (err) {
    console.error("Analytics Aggregation Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
