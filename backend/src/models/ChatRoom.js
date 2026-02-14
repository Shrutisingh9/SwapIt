const mongoose = require("mongoose");
const { Schema } = mongoose;

const ChatRoomSchema = new Schema(
  {
    swapId: { type: Schema.Types.ObjectId, ref: "Swap", required: true, unique: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatRoom", ChatRoomSchema);
