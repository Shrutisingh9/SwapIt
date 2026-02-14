const mongoose = require("mongoose");
const { Schema } = mongoose;

const SwapSchema = new Schema(
  {
    requesterId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    responderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    requestedItemId: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    offeredItemId: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED", "CANCELLED", "COMPLETED"],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Swap", SwapSchema);
