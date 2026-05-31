import mongoose, { Schema } from "mongoose";

const WidgetDataSchema = new Schema(
  {
    widgetId: {
      type: Schema.Types.ObjectId,
      ref: "Widget",
      required: true,
      index: true,
    },
    treeId: {
      type: Schema.Types.ObjectId,
      ref: "Tree",
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    dataType: {
      type: String,
      required: true,
      enum: ["email", "form_submission", "booking_request", "donation", "inquiry", "custom"],
    },
    data: {
      type: Map,
      of: Schema.Types.Mixed,
      required: true,
    },
    status: {
      type: String,
      enum: ["new", "contacted", "converted", "archived"],
      default: "new",
    },
    metadata: {
      ip: { type: String, default: "" },
      userAgent: { type: String, default: "" },
      referrer: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

// Compound index for querying widget data by tree and type efficiently
WidgetDataSchema.index({ treeId: 1, dataType: 1, createdAt: -1 });

if (mongoose.models && mongoose.models.WidgetData) {
  delete mongoose.models.WidgetData;
}
const WidgetData = mongoose.model("WidgetData", WidgetDataSchema);
export default WidgetData;
