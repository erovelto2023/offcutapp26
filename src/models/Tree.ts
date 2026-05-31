import mongoose, { Schema } from "mongoose";

const TreeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    type: {
      type: String,
      default: "default", // e.g. 'default' | 'tabs' | 'video'
    },
    name: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    avatarUrl: {
      type: String,
      default: "",
    },
    theme: {
      type: String,
      default: "midnight", // 'midnight' | 'sunset' | 'cyberpunk' | 'emerald'
    },
    themeSettings: {
      themeType: { type: String, default: "preset" }, // "preset" | "custom"
      backgroundType: { type: String, default: "gradient" }, // "solid" | "gradient" | "image"
      backgroundColor: { type: String, default: "#09090b" },
      backgroundGradientStart: { type: String, default: "#0f172a" },
      backgroundGradientEnd: { type: String, default: "#1e1b4b" },
      backgroundImageUrl: { type: String, default: "" },
      fontFamily: { type: String, default: "sans" }, // "sans" | "serif" | "mono" | "display"
      cardStyle: { type: String, default: "glassmorphic" }, // "glassmorphic" | "flat" | "outline" | "neon"
      cardRoundness: { type: String, default: "rounded-xl" }, // "rounded-none" | "rounded-xl" | "rounded-full"
      textColor: { type: String, default: "#ffffff" },
      accentColor: { type: String, default: "#8b5cf6" },
      buttonColor: { type: String, default: "" },
    },
    socials: {
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      github: { type: String, default: "" },
      youtube: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      tiktok: { type: String, default: "" },
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
    },
    tabs: {
      type: [String],
      default: [], // Stores creator's custom category list in preferred order
    },
    nicheSettings: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models.Tree) {
  delete mongoose.models.Tree;
}
const Tree = mongoose.model("Tree", TreeSchema);
export default Tree;
