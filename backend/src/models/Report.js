const mongoose = require("mongoose");
const { Schema } = mongoose;

const ReportSchema = new Schema(
  {
    reporterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    targetUserId: { type: Schema.Types.ObjectId, ref: "User" },
    targetItemId: { type: Schema.Types.ObjectId, ref: "Item" },
    targetSwapId: { type: Schema.Types.ObjectId, ref: "Swap" },
    reason: { type: String, required: true },
    details: { type: String },
    status: { type: String, enum: ["OPEN", "RESOLVED"], default: "OPEN" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", ReportSchema);

