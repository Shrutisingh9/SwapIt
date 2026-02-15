const mongoose = require("mongoose");
const ChatRoom = require("../../models/ChatRoom");
const Message = require("../../models/Message");
const Swap = require("../../models/Swap");
const Item = require("../../models/Item");
const User = require("../../models/User");
const DeletedContact = require("../../models/DeletedContact");

class ChatService {
  async listConversations(userId) {
    const userObjId = new mongoose.Types.ObjectId(userId);
    const deleted = await DeletedContact.find({ userId: userObjId }).select("deletedContactId");
    const deletedIds = new Set(deleted.map((d) => d.deletedContactId.toString()));

    // Swap-based conversations
    const swaps = await Swap.find({
      $or: [{ requesterId: userObjId }, { responderId: userObjId }]
    })
      .populate("requesterId", "name email")
      .populate("responderId", "name email")
      .populate("requestedItemId", "title images")
      .populate("offeredItemId", "title images")
      .sort({ updatedAt: -1 });

    const swapRoomIds = swaps.map((s) => s._id);
    const rooms = await ChatRoom.find({ swapId: { $in: swapRoomIds } });
    const roomBySwap = Object.fromEntries(rooms.map((r) => [r.swapId.toString(), r._id.toString()]));

    const swapConversations = await Promise.all(
      swaps.map(async (swap) => {
        const roomId = roomBySwap[swap._id.toString()];
        let lastMessage = null;
        if (roomId) {
          lastMessage = await Message.findOne({ roomId: new mongoose.Types.ObjectId(roomId) })
            .populate("senderId", "name")
            .sort({ createdAt: -1 })
            .lean();
        }
        const requesterIdStr = swap.requesterId?._id?.toString() || swap.requesterId?.toString();
        const otherUser = requesterIdStr === userId ? swap.responderId : swap.requesterId;
        const otherId = otherUser?._id?.toString() || otherUser?.toString();
        if (otherId && deletedIds.has(otherId)) return null;
        return {
          _id: swap._id,
          swapId: swap._id,
          chatRoomId: roomId,
          type: "swap",
          otherUser: otherUser ? { id: otherUser._id, name: otherUser.name } : null,
          lastMessage: lastMessage ? { body: lastMessage.body, createdAt: lastMessage.createdAt, senderName: lastMessage.senderId?.name } : null,
          requestedItem: swap.requestedItemId?.title,
          offeredItem: swap.offeredItemId?.title,
          status: swap.status,
          updatedAt: swap.updatedAt
        };
      })
    );

    // Direct conversations (from item page chat)
    const directRooms = await ChatRoom.find({
      participantIds: userObjId,
      $or: [{ swapId: { $exists: false } }, { swapId: null }]
    })
      .populate("participantIds", "name")
      .populate("itemId", "title")
      .sort({ updatedAt: -1 });

    const directConversations = await Promise.all(
      directRooms.map(async (room) => {
        const pIds = room.participantIds || [];
        const other = pIds.find((p) => (p._id || p).toString() !== userId);
        const otherUser = other ? { id: other._id || other, name: other.name } : null;
        if (otherUser && deletedIds.has(String(otherUser.id))) return null;
        const lastMessage = await Message.findOne({ roomId: room._id })
          .populate("senderId", "name")
          .sort({ createdAt: -1 })
          .lean();
        return {
          _id: room._id.toString(),
          swapId: null,
          chatRoomId: room._id.toString(),
          type: "direct",
          otherUser,
          lastMessage: lastMessage ? { body: lastMessage.body, createdAt: lastMessage.createdAt, senderName: lastMessage.senderId?.name } : null,
          requestedItem: room.itemId?.title,
          offeredItem: null,
          status: null,
          updatedAt: room.updatedAt
        };
      })
    );

    const all = [
      ...swapConversations.filter(Boolean),
      ...directConversations.filter(Boolean)
    ].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    // WhatsApp-style: one entry per person - keep only the most recent conversation per otherUser
    const byUser = new Map();
    for (const conv of all) {
      const otherId = conv.otherUser?.id?.toString?.() || conv.otherUser?.id;
      if (!otherId) continue;
      const existing = byUser.get(otherId);
      const convTime = new Date(conv.lastMessage?.createdAt || conv.updatedAt || 0);
      const existingTime = existing ? new Date(existing.lastMessage?.createdAt || existing.updatedAt || 0) : 0;
      if (!existing || convTime > existingTime) {
        byUser.set(otherId, conv);
      }
    }

    return Array.from(byUser.values()).sort(
      (a, b) =>
        new Date(b.lastMessage?.createdAt || b.updatedAt || 0) -
        new Date(a.lastMessage?.createdAt || a.updatedAt || 0)
    );
  }

  async getOrCreateDirectRoom(userId, otherUserId, itemId) {
    if (userId === otherUserId) {
      const err = new Error("Cannot chat with yourself");
      err.statusCode = 400;
      throw err;
    }
    const ids = [userId, otherUserId].map((id) => new mongoose.Types.ObjectId(id)).sort((a, b) => a.toString().localeCompare(b.toString()));
    let room = await ChatRoom.findOne({
      participantIds: { $all: ids },
      $or: [{ swapId: { $exists: false } }, { swapId: null }]
    });
    if (!room) {
      room = await ChatRoom.create({
        participantIds: ids,
        itemId: itemId ? new mongoose.Types.ObjectId(itemId) : undefined
      });
    }
    return room;
  }

  async deleteContact(userId, contactId) {
    await DeletedContact.findOneAndUpdate(
      { userId: new mongoose.Types.ObjectId(userId), deletedContactId: new mongoose.Types.ObjectId(contactId) },
      { userId: new mongoose.Types.ObjectId(userId), deletedContactId: new mongoose.Types.ObjectId(contactId) },
      { upsert: true }
    );
  }

  async getRoomBySwap(userId, swapId) {
    const swap = await Swap.findById(swapId);
    if (!swap) {
      const err = new Error("Swap not found");
      err.statusCode = 404;
      throw err;
    }
    if (swap.requesterId.toString() !== userId && swap.responderId.toString() !== userId) {
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
    const room = await ChatRoom.findById(roomId).populate({ path: "swapId", model: Swap });
    if (!room) {
      const err = new Error("Chat room not found");
      err.statusCode = 404;
      throw err;
    }
    if (room.swapId) {
      const swap = room.swapId;
      if (swap.requesterId.toString() !== userId && swap.responderId.toString() !== userId) {
        const err = new Error("You are not a participant in this chat room");
        err.statusCode = 403;
        throw err;
      }
    } else if (room.participantIds && room.participantIds.length) {
      const ids = room.participantIds.map((p) => (p._id || p).toString());
      if (!ids.includes(userId)) {
        const err = new Error("You are not a participant in this chat room");
        err.statusCode = 403;
        throw err;
      }
    } else {
      const err = new Error("Invalid chat room");
      err.statusCode = 400;
      throw err;
    }
    return Message.find({ roomId: new mongoose.Types.ObjectId(roomId) })
      .populate("senderId", "name email")
      .sort({ createdAt: 1 });
  }

  async createMessage(userId, roomId, body) {
    const room = await ChatRoom.findById(roomId).populate({ path: "swapId", model: Swap });
    if (!room) {
      const err = new Error("Chat room not found");
      err.statusCode = 404;
      throw err;
    }
    if (room.swapId) {
      const swap = room.swapId;
      if (swap.requesterId.toString() !== userId && swap.responderId.toString() !== userId) {
        const err = new Error("You are not a participant in this chat room");
        err.statusCode = 403;
        throw err;
      }
    } else if (room.participantIds && room.participantIds.length) {
      const ids = room.participantIds.map((p) => (p._id || p).toString());
      if (!ids.includes(userId)) {
        const err = new Error("You are not a participant in this chat room");
        err.statusCode = 403;
        throw err;
      }
    } else {
      const err = new Error("Invalid chat room");
      err.statusCode = 400;
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
