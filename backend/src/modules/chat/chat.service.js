const mongoose = require("mongoose");
const ChatRoom = require("../../models/ChatRoom");
const Message = require("../../models/Message");
const Swap = require("../../models/Swap");

class ChatService {
  async getRoomBySwap(userId, swapId) {
    const swap = await Swap.findById(swapId);

    if (!swap) {
      const err = new Error("Swap not found");
      err.statusCode = 404;
      throw err;
    }

    if (
      swap.requesterId.toString() !== userId &&
      swap.responderId.toString() !== userId
    ) {
      const err = new Error("You are not a participant in this swap/chat");
      err.statusCode = 403;
      throw err;
    }

    let chatRoom = await ChatRoom.findOne({ swapId: new mongoose.Types.ObjectId(swapId) });

    if (!chatRoom) {
      chatRoom = await ChatRoom.create({
        swapId: new mongoose.Types.ObjectId(swapId)
      });
    }

    return chatRoom;
  }

  async listMessages(userId, roomId) {
    const room = await ChatRoom.findById(roomId).populate({
      path: "swapId",
      model: Swap
    });

    if (!room) {
      const err = new Error("Chat room not found");
      err.statusCode = 404;
      throw err;
    }

    const swap = room.swapId;

    if (
      swap.requesterId.toString() !== userId &&
      swap.responderId.toString() !== userId
    ) {
      const err = new Error("You are not a participant in this chat room");
      err.statusCode = 403;
      throw err;
    }

    return Message.find({ roomId: new mongoose.Types.ObjectId(roomId) })
      .populate("senderId", "name email")
      .sort({ createdAt: 1 });
  }

  async createMessage(userId, roomId, body) {
    const room = await ChatRoom.findById(roomId).populate({
      path: "swapId",
      model: Swap
    });

    if (!room) {
      const err = new Error("Chat room not found");
      err.statusCode = 404;
      throw err;
    }

    const swap = room.swapId;

    if (
      swap.requesterId.toString() !== userId &&
      swap.responderId.toString() !== userId
    ) {
      const err = new Error("You are not a participant in this chat room");
      err.statusCode = 403;
      throw err;
    }

    const message = await Message.create({
      roomId: new mongoose.Types.ObjectId(roomId),
      senderId: new mongoose.Types.ObjectId(userId),
      body
    });

    await message.populate("senderId", "name email");

    return message;
  }
}

module.exports = ChatService;
