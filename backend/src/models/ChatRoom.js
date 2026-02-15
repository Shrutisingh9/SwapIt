const mongoose = require("mongoose");
const { Schema } = mongoose;

const ChatRoomSchema = new Schema(
  {
    swapId: { type: Schema.Types.ObjectId, ref: "Swap", sparse: true },
    participantIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    itemId: { type: Schema.Types.ObjectId, ref: "Item" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatRoom", ChatRoomSchema);
