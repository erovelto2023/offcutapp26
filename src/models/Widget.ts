import mongoose, { Schema } from "mongoose";

const WidgetSchema = new Schema(
  {
    treeId: {
      type: Schema.Types.ObjectId,
      ref: "Tree",
      required: true,
      index: true,
    },
    widgetType: {
      type: String,
      required: true,
      enum: [
        "email_collection",
        "arc_reader",
        "author_book",
        "musician_tour",
        "coach_booking",
        "realtor_listing",
        "nonprofit_fundraiser",
        "gamer_stream",
        "influencer_stats",
        "artist_portfolio",
        "photographer_estimator",
        "podcaster_player",
        "youtuber_video",
        "smallbusiness_services",
        "speaker_topics",
        "teacher_resources",
        "newsletter_signup",
        "custom_html",
      ],
    },
    title: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    config: {
      type: Map,
      of: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Compound index for querying widgets by tree and order efficiently
WidgetSchema.index({ treeId: 1, order: 1 });

if (mongoose.models && mongoose.models.Widget) {
  delete mongoose.models.Widget;
}
const Widget = mongoose.model("Widget", WidgetSchema);
export default Widget;
