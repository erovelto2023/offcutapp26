import mongoose, { Schema } from "mongoose";

const LinkSchema = new Schema(
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    icon: {
      type: String,
      default: "", // Can store emojis or Lucide icon identifiers
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    clicksCount: {
      type: Number,
      default: 0,
    },
    animationStyle: {
      type: String,
      enum: ["none", "pulse", "bounce", "shine"],
      default: "none",
    },
    tab: {
      type: String,
      default: "", // Empty string means uncategorized or default general view
    },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models.Link) {
  delete mongoose.models.Link;
}
const Link = mongoose.model("Link", LinkSchema);
export default Link;
