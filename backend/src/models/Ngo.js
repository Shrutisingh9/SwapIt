const mongoose = require("mongoose");
const { Schema } = mongoose;

// Simple NGO model to support donation targeting.
const NgoSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    city: { type: String },
    country: { type: String },
    categories: [{ type: String }], // e.g. "Clothes", "Books"
    contactEmail: { type: String },
    website: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ngo", NgoSchema);

