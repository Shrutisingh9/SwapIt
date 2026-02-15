const mongoose = require("mongoose");
const { Schema } = mongoose;

const DeletedContactSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    deletedContactId: { type: Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

DeletedContactSchema.index({ userId: 1, deletedContactId: 1 }, { unique: true });

module.exports = mongoose.model("DeletedContact", DeletedContactSchema);
