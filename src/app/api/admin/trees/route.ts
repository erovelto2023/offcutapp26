import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { getSession } from "@/lib/auth";
import Tree from "@/models/Tree";
import User from "@/models/User";
import Link from "@/models/Link";
import Analytics from "@/models/Analytics";
import mongoose from "mongoose";

export async function GET() {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.userId;

    // Check if user already has linktree profiles
    let userTrees = await Tree.find({ userId }).sort({ createdAt: -1 });
    let migrated = false;

    if (userTrees.length === 0) {
      // 100% Automated, lossless zero-downtime data migration!
      const user = await User.findById(userId);
      if (user) {
        console.log(`Migrating legacy profile for @${user.username} to new Tree document...`);
        
        // 1. Create a default tree from their legacy User settings
        const defaultTree = await Tree.create({
          userId: user._id,
          slug: user.username,
          type: "default",
          name: user.name || user.username,
          bio: user.bio || "Welcome to my Offcut Links!",
          avatarUrl: user.avatarUrl || "",
          theme: user.theme || "midnight",
          themeSettings: user.themeSettings || {
            themeType: "preset",
            backgroundType: "gradient",
            backgroundColor: "#09090b",
            backgroundGradientStart: "#0f172a",
            backgroundGradientEnd: "#1e1b4b",
            backgroundImageUrl: "",
            fontFamily: "sans",
            cardStyle: "glassmorphic",
            cardRoundness: "rounded-xl",
            textColor: "#ffffff",
            accentColor: "#8b5cf6",
            buttonColor: "",
          },
          socials: user.socials || {
            twitter: "",
            instagram: "",
            github: "",
            youtube: "",
            linkedin: "",
            tiktok: "",
            email: "",
            phone: "",
          },
          tabs: user.tabs || [],
        });

        // 2. Associate existing legacy Links with the default tree
        const linkUpdateResult = await Link.updateMany(
          { userId: user._id, treeId: { $exists: false } },
          { $set: { treeId: defaultTree._id } }
        );
        console.log(`Associated ${linkUpdateResult.modifiedCount} legacy links with Tree @${user.username}`);

        // 3. Associate existing legacy Analytics records with the default tree
        const analyticsUpdateResult = await Analytics.updateMany(
          { userId: user._id, treeId: { $exists: false } },
          { $set: { treeId: defaultTree._id } }
        );
        console.log(`Associated ${analyticsUpdateResult.modifiedCount} legacy analytics logs with Tree @${user.username}`);

        userTrees = [defaultTree];
        migrated = true;
      }
    }

    // Include statistics inside trees list
    const enrichedTrees = await Promise.all(
      userTrees.map(async (tree) => {
        const viewsCount = await Analytics.countDocuments({ treeId: tree._id, type: "view" });
        const clicksCount = await Analytics.countDocuments({ treeId: tree._id, type: "click" });
        return {
          ...tree.toObject(),
          viewsCount,
          clicksCount,
        };
      })
    );

    return NextResponse.json({ trees: enrichedTrees, migrated });
  } catch (err) {
    console.error("GET Trees Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { slug, name, type } = await req.json();
    const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");

    if (cleanSlug.length < 3) {
      return NextResponse.json({ error: "Slug must be at least 3 characters." }, { status: 400 });
    }

    // Reserved keywords check
    const reserved = ["admin", "login", "register", "api", "dashboard", "settings", "theme", "click", "view", "members"];
    if (reserved.includes(cleanSlug)) {
      return NextResponse.json({ error: "This slug handle is reserved." }, { status: 400 });
    }

    // Duplicate slug check across ALL Trees and Usernames
    const existingTree = await Tree.findOne({ slug: cleanSlug });
    const existingUser = await User.findOne({ username: cleanSlug });
    if (existingTree || existingUser) {
      return NextResponse.json({ error: "This URL slug handle is already taken." }, { status: 400 });
    }

    const tabsMap: Record<string, string[]> = {
      author: ["Books", "Platform"],
      influencer: ["Content Creator", "Engagement"],
      coach: ["Acquisition", "Resources"],
      musician: ["Music", "Tour"],
      artist: ["Portfolio", "Gallery"],
      photographer: ["Galleries", "Booking"],
      realtor: ["Listings", "Resources"],
      podcaster: ["Episodes", "Community"],
      youtuber: ["Videos", "Gear"],
      smallbusiness: ["Services", "Operations"],
      nonprofit: ["Fundraising", "Impact"],
      teacher: ["Classes", "Resources"],
      gamer: ["Streams", "Setup"],
      speaker: ["Topics", "Speaking"]
    };

    const targetTabs = tabsMap[type] || [];

    const linksSeedMap: Record<string, Array<{ title: string; url: string; icon: string; tab: string; order: number }>> = {
      author: [
        { title: "Featured Book on Amazon", url: "https://amazon.com", icon: "📖", tab: "Books", order: 0 },
        { title: "Join the ARC Review Team", url: "https://forms.google.com", icon: "✨", tab: "Books", order: 1 },
        { title: "Subscribe to the Newsletter", url: "https://substack.com", icon: "📧", tab: "Platform", order: 2 }
      ],
      musician: [
        { title: "Latest Release on Spotify", url: "https://spotify.com", icon: "🎵", tab: "Music", order: 0 },
        { title: "Get Concert Tickets (Ticketmaster)", url: "https://ticketmaster.com", icon: "🎫", tab: "Tour", order: 1 },
        { title: "Official Merchandise Store", url: "https://shopify.com", icon: "👕", tab: "Music", order: 2 }
      ],
      coach: [
        { title: "Book a Free 15-Min Discovery Call", url: "https://calendly.com", icon: "📞", tab: "Acquisition", order: 0 },
        { title: "Download Free Success Blueprint PDF", url: "https://google.com", icon: "📘", tab: "Resources", order: 1 }
      ],
      realtor: [
        { title: "View Featured Listings on Zillow", url: "https://zillow.com", icon: "🏡", tab: "Listings", order: 0 },
        { title: "Request a Free Home Valuation Report", url: "https://google.com", icon: "📊", tab: "Resources", order: 1 }
      ],
      podcaster: [
        { title: "Listen on Apple Podcasts", url: "https://podcasts.apple.com", icon: "🎙️", tab: "Episodes", order: 0 },
        { title: "Apply to be a Podcast Guest", url: "https://forms.google.com", icon: "✍️", tab: "Community", order: 1 }
      ],
      youtuber: [
        { title: "Watch My Latest Video", url: "https://youtube.com", icon: "📺", tab: "Videos", order: 0 },
        { title: "My Camera Gear & Setup Equipment", url: "https://amazon.com", icon: "🎥", tab: "Gear", order: 1 }
      ],
      gamer: [
        { title: "Twitch Live Stream Channel", url: "https://twitch.tv", icon: "🎮", tab: "Streams", order: 0 },
        { title: "Join the Discord Server", url: "https://discord.gg", icon: "💬", tab: "Setup", order: 1 }
      ]
    };

    const targetSeeds = linksSeedMap[type] || [
      { title: "My Custom Website Link", url: "https://google.com", icon: "🔗", tab: "", order: 0 }
    ];

    const defaultNicheSettingsMap: Record<string, Record<string, any>> = {
      author: {
        authorBookTitle: "The Offcut Legacy: Book 1",
        authorBookDesc: "Unlock the secrets of multi-tenant workspace architecture. A gripping techno-thriller on data isolation.",
        authorAmazonUrl: "https://amazon.com",
        authorCoverTitle: "The Offcut Legacy",
        authorCoverAuthor: "by Kathleen",
        authorCountdownDate: "2026-12-31"
      },
      musician: {
        musicianSpotifyUrl: "https://spotify.com",
        musicianTour1Date: "JUN 12",
        musicianTour1City: "New York, NY",
        musicianTour1Venue: "Madison Square Garden"
      },
      coach: {
        coachSuccessStory: "The scheduling was seamless and the discovery call set up my roadmap perfectly!",
        coachSuccessAuthor: "Kathleen H.",
        coachSlot1: "9:00 AM"
      },
      realtor: {
        realtorAddress: "742 Evergreen Terrace",
        realtorPrice: 450000,
        realtorDetails: "4 Bed • 3 Bath • 2,400 Sq Ft",
        realtorDescription: "Located in premium residential zoning with landscaped backyard, deck, and solar grids."
      },
      nonprofit: {
        nonprofitTitle: "Clean Ocean Water Initiative",
        nonprofitDesc: "Every contribution directly funds filtering setups for coastal preservation groups.",
        nonprofitGoalAmount: 10000,
        nonprofitRaisedAmount: 6450
      },
      gamer: {
        gamerStreamTitle: "Kathleen Plays: Techno-Cyberpunk 2077",
        gamerGpu: "NVIDIA RTX 4090",
        gamerCpu: "AMD Ryzen 9 7950X",
        gamerCooler: "Corsair H150i AIO",
        gamerRam: "64GB DDR5 6000Mhz"
      },
      influencer: {
        influencerFollowers: "124K",
        influencerReach: "850K",
        influencerEngagement: "6.2%"
      },
      artist: {
        artistArtTitle1: "Obsidian Echoes",
        artistArtTech1: "Acrylic on Canvas",
        artistArtTitle2: "Fluid Architectures",
        artistArtTech2: "Giclée Fine Art Print"
      },
      photographer: {
        photographerHourlyRate: 150,
        photographerStudioFee: 75
      }
    };

    const targetNicheSettings = defaultNicheSettingsMap[type] || {};

    const tree = await Tree.create({
      userId: session.userId,
      slug: cleanSlug,
      type: type || "default",
      name: name || cleanSlug,
      bio: `Welcome to my professional ${type || "linktree"} workspace!`,
      theme: "midnight",
      tabs: targetTabs,
      nicheSettings: targetNicheSettings,
    });

    for (const seed of targetSeeds) {
      await Link.create({
        userId: session.userId,
        treeId: tree._id,
        title: seed.title,
        url: seed.url,
        icon: seed.icon,
        tab: seed.tab,
        order: seed.order,
        isActive: true,
      });
    }

    return NextResponse.json({ success: true, tree });
  } catch (err) {
    console.error("POST Tree Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const session = await getSession();

    if (!session || !session.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing Tree ID parameter" }, { status: 400 });
    }

    // Verify ownership
    const tree = await Tree.findOne({ _id: id, userId: session.userId });
    if (!tree) {
      return NextResponse.json({ error: "Tree profile not found or unauthorized" }, { status: 404 });
    }

    // Delete associated Links, Analytics logs, and then the Tree itself
    await Link.deleteMany({ treeId: tree._id });
    await Analytics.deleteMany({ treeId: tree._id });
    await Tree.deleteOne({ _id: tree._id });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE Tree Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
