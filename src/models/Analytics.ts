import mongoose, { Schema } from "mongoose";

const AnalyticsSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    treeId: {
      type: Schema.Types.ObjectId,
      ref: "Tree",
      index: true,
      default: null,
    },
    linkId: {
      type: Schema.Types.ObjectId,
      ref: "Link",
      default: null, // If null, it represents a page view event
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["view", "click"],
      index: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
    referrer: {
      type: String,
      default: "direct",
    },
    keywords: {
      type: String,
      default: "",
    },
    utmSource: {
      type: String,
      default: "",
    },
    utmMedium: {
      type: String,
      default: "",
    },
    utmCampaign: {
      type: String,
      default: "",
    },
    device: {
      type: String,
      default: "unknown", // 'desktop' | 'mobile' | 'tablet' | 'unknown'
    },
    browser: {
      type: String,
      default: "unknown",
    },
  },
  { timestamps: true }
);

// Compound index for querying events by user, type, and time efficiently
AnalyticsSchema.index({ userId: 1, type: 1, timestamp: -1 });

if (mongoose.models && mongoose.models.Analytics) {
  delete mongoose.models.Analytics;
}
const Analytics = mongoose.model("Analytics", AnalyticsSchema);
export default Analytics;
