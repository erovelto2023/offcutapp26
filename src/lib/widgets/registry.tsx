import React from "react";
import EmailCollectionWidget from "@/components/widgets/EmailCollectionWidget";
import ARCReaderWidget from "@/components/widgets/ARCReaderWidget";
import BookPromotionWidget from "@/components/widgets/BookPromotionWidget";
import TourDatesWidget from "@/components/widgets/TourDatesWidget";
import BookingSlotsWidget from "@/components/widgets/BookingSlotsWidget";
import PropertyListingWidget from "@/components/widgets/PropertyListingWidget";
import FundraisingCampaignWidget from "@/components/widgets/FundraisingCampaignWidget";
import PodcastPlayerWidget from "@/components/widgets/PodcastPlayerWidget";
import PlaceholderWidget from "@/components/widgets/PlaceholderWidget";

export interface WidgetConfig {
  widgetType: string;
  title: string;
  description: string;
  icon: string;
  category: "engagement" | "showcase" | "booking" | "commerce" | "content";
  defaultConfig: Record<string, any>;
}

export const WIDGET_REGISTRY: Record<string, WidgetConfig> = {
  email_collection: {
    widgetType: "email_collection",
    title: "Newsletter Signup",
    description: "Collect email addresses for your newsletter",
    icon: "📧",
    category: "engagement",
    defaultConfig: {
      title: "Join Our Newsletter",
      description: "Get the latest updates delivered to your inbox",
      buttonText: "Subscribe",
      collectName: false,
      collectionName: "newsletter",
      successMessage: "Thank you for subscribing!",
    },
  },
  arc_reader: {
    widgetType: "arc_reader",
    title: "ARC Reader Signup",
    description: "Collect applications for your ARC review team",
    icon: "📖",
    category: "engagement",
    defaultConfig: {
      bookTitle: "Your Book Title",
      bookDescription: "A brief description of your book",
      arcLink: "",
      coverTitle: "Book Title",
      coverAuthor: "Author Name",
      buttonText: "Apply for ARC Team",
      successMessage: "Thank you for your application!",
    },
  },
  author_book: {
    widgetType: "author_book",
    title: "Book Promotion",
    description: "Showcase your book with buy links and sample download",
    icon: "📚",
    category: "showcase",
    defaultConfig: {
      bookTitle: "Book Title",
      bookDescription: "Book description",
      amazonUrl: "https://amazon.com",
      coverImageUrl: "",
      coverTitle: "Book Title",
      coverAuthor: "Author Name",
      buttonColor: "#8b5cf6",
    },
  },
  musician_tour: {
    widgetType: "musician_tour",
    title: "Tour Dates",
    description: "Display upcoming concert dates and ticket links",
    icon: "🎵",
    category: "showcase",
    defaultConfig: {
      tourName: "World Tour 2024",
      tours: [
        { date: "JUN 12", city: "New York, NY", venue: "Madison Square Garden", bookingUrl: "" },
      ],
      buttonColor: "#8b5cf6",
    },
  },
  coach_booking: {
    widgetType: "coach_booking",
    title: "Booking Slots",
    description: "Let clients book discovery calls with you",
    icon: "📞",
    category: "booking",
    defaultConfig: {
      calendarView: false,
      slots: ["9:00 AM", "11:30 AM", "2:00 PM", "4:30 PM"],
      buttonColor: "#8b5cf6",
    },
  },
  realtor_listing: {
    widgetType: "realtor_listing",
    title: "Property Listing",
    description: "Showcase property with mortgage calculator",
    icon: "🏡",
    category: "commerce",
    defaultConfig: {
      address: "123 Main St",
      price: 450000,
      details: "4 Bed • 3 Bath • 2,400 Sq Ft",
      description: "Property description",
      images: [],
      slideshow: false,
      buttonColor: "#8b5cf6",
    },
  },
  nonprofit_fundraiser: {
    widgetType: "nonprofit_fundraiser",
    title: "Fundraising Campaign",
    description: "Track donation progress with goal",
    icon: "❤️",
    category: "commerce",
    defaultConfig: {
      title: "Campaign Title",
      description: "Campaign description",
      goal: 10000,
      raised: 0,
      fundraisingUrl: "",
      buttonColor: "#8b5cf6",
    },
  },
  gamer_stream: {
    widgetType: "gamer_stream",
    title: "Stream Status",
    description: "Show live stream status and gaming specs",
    icon: "🎮",
    category: "showcase",
    defaultConfig: {
      streamTitle: "Stream Title",
      platform: "twitch",
      specs: {
        gpu: "NVIDIA RTX 4090",
        cpu: "AMD Ryzen 9 7950X",
      },
    },
  },
  influencer_stats: {
    widgetType: "influencer_stats",
    title: "Creator Stats",
    description: "Display follower count and engagement metrics",
    icon: "✨",
    category: "showcase",
    defaultConfig: {
      followers: "124K",
      reach: "850K",
      engagement: "6.2%",
    },
  },
  artist_portfolio: {
    widgetType: "artist_portfolio",
    title: "Art Portfolio",
    description: "Showcase artwork with purchase inquiries",
    icon: "🎨",
    category: "showcase",
    defaultConfig: {
      artworks: [
        { title: "Artwork Title", type: "Painting", price: "$1,200", tech: "Acrylic on Canvas" },
      ],
    },
  },
  photographer_estimator: {
    widgetType: "photographer_estimator",
    title: "Session Estimator",
    description: "Calculate photography session pricing",
    icon: "📷",
    category: "commerce",
    defaultConfig: {
      hourlyRate: 150,
      studioFee: 75,
    },
  },
  podcaster_player: {
    widgetType: "podcaster_player",
    title: "Podcast Player",
    description: "Embed podcast episode player",
    icon: "🎙️",
    category: "content",
    defaultConfig: {
      episodeTitle: "Episode Title",
      episodeNumber: "42",
      duration: "48 min",
      audioUrl: "",
      platforms: ["spotify", "apple"],
      buttonColor: "#8b5cf6",
    },
  },
  youtuber_video: {
    widgetType: "youtuber_video",
    title: "Video Spotlight",
    description: "Feature your latest YouTube video",
    icon: "📺",
    category: "content",
    defaultConfig: {
      videoTitle: "Video Title",
      videoId: "",
      thumbnail: "",
    },
  },
  smallbusiness_services: {
    widgetType: "smallbusiness_services",
    title: "Services List",
    description: "Display your services with booking",
    icon: "💼",
    category: "booking",
    defaultConfig: {
      services: [
        { name: "Consulting Hour", duration: "60 mins", price: "$120" },
      ],
    },
  },
  speaker_topics: {
    widgetType: "speaker_topics",
    title: "Speaking Topics",
    description: "Showcase your signature speaking topics",
    icon: "🎤",
    category: "showcase",
    defaultConfig: {
      topics: [
        "Topic 1",
        "Topic 2",
        "Topic 3",
      ],
    },
  },
  teacher_resources: {
    widgetType: "teacher_resources",
    title: "Resource Downloads",
    description: "Share downloadable course materials",
    icon: "📚",
    category: "content",
    defaultConfig: {
      files: [
        { name: "Syllabus.pdf", size: "1.2 MB", url: "" },
      ],
    },
  },
};

export const WIDGET_COMPONENTS: Record<string, React.ComponentType<any>> = {
  email_collection: EmailCollectionWidget,
  arc_reader: ARCReaderWidget,
  author_book: BookPromotionWidget,
  musician_tour: TourDatesWidget,
  coach_booking: BookingSlotsWidget,
  realtor_listing: PropertyListingWidget,
  nonprofit_fundraiser: FundraisingCampaignWidget,
  podcaster_player: PodcastPlayerWidget,
  gamer_stream: (props) => <PlaceholderWidget title="Stream Status" {...props} />,
  influencer_stats: (props) => <PlaceholderWidget title="Creator Stats" {...props} />,
  artist_portfolio: (props) => <PlaceholderWidget title="Art Portfolio" {...props} />,
  photographer_estimator: (props) => <PlaceholderWidget title="Session Estimator" {...props} />,
  youtuber_video: (props) => <PlaceholderWidget title="Video Spotlight" {...props} />,
  smallbusiness_services: (props) => <PlaceholderWidget title="Services List" {...props} />,
  speaker_topics: (props) => <PlaceholderWidget title="Speaking Topics" {...props} />,
  teacher_resources: (props) => <PlaceholderWidget title="Resource Downloads" {...props} />,
};

export function getWidgetConfig(widgetType: string): WidgetConfig | null {
  return WIDGET_REGISTRY[widgetType] || null;
}

export function getWidgetComponent(widgetType: string): React.ComponentType<any> | null {
  return WIDGET_COMPONENTS[widgetType] || null;
}

export function getWidgetsByCategory(category: WidgetConfig["category"]): WidgetConfig[] {
  return Object.values(WIDGET_REGISTRY).filter((w) => w.category === category);
}

export function getAllWidgetConfigs(): WidgetConfig[] {
  return Object.values(WIDGET_REGISTRY);
}
