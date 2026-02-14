const mongoose = require("mongoose");
const { Schema } = mongoose;

const RatingSchema = new Schema(
  {
    fromUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    toUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    swapId: { type: Schema.Types.ObjectId, ref: "Swap", required: true },
    score: { type: Number, required: true, min: 1, max: 5 }
  },
  { timestamps: true }
);

RatingSchema.index({ fromUserId: 1, swapId: 1 }, { unique: true });

module.exports = mongoose.model("Rating", RatingSchema);
