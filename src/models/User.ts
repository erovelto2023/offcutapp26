import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
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
      backgroundType: { type: String, default: "gradient" }, // "solid" | "gradient"
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
      default: [], // Stores user's custom category list in preferred order
    },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models.User) {
  delete mongoose.models.User;
}
const User = mongoose.model("User", UserSchema);
export default User;
