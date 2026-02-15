const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    location: { type: String },
    gender: { type: String, enum: ["Male", "Female", "Other"], default: null },
    dateOfBirth: { type: Date, default: null },
    phone: { type: String, default: null },
    showPhoneInProfile: { type: Boolean, default: false },
    avatarUrl: { type: String },
    bio: { type: String },
    rating: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    swapPoints: { type: Number, default: 0 },
    // Trust & admin flags
    isVerified: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    // Saved items / wishlist
    savedItems: [{ type: Schema.Types.ObjectId, ref: "Item" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
