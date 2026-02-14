const mongoose = require("mongoose");
const { Schema } = mongoose;

const ItemImageSchema = new Schema({
  url: { type: String, required: true },
  order: { type: Number, default: 0 }
});

const ItemSchema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    condition: {
      type: String,
      enum: ["NEW", "GOOD", "USED", "POOR"],
      required: true
    },
    location: { type: String },
    status: {
      type: String,
      enum: ["AVAILABLE", "SWAPPED", "ARCHIVED"],
      default: "AVAILABLE"
    },
    // Swap / Donation flags
    isForSwap: { type: Boolean, default: true },
    isForDonation: { type: Boolean, default: false },
    // Optional NGO target when donating
    ngoId: { type: Schema.Types.ObjectId, ref: "Ngo", default: null },
    tags: [{ type: String }],
    images: [ItemImageSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Item", ItemSchema);
