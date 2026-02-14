const mongoose = require("mongoose");
const Swap = require("../../models/Swap");
const Item = require("../../models/Item");
const ChatRoom = require("../../models/ChatRoom");
const User = require("../../models/User");
const Notification = require("../../models/Notification");

class SwapService {
  async createSwap(requesterId, dto) {
    const [requestedItem, offeredItem] = await Promise.all([
      Item.findById(dto.requestedItemId),
      Item.findById(dto.offeredItemId)
    ]);

    if (!requestedItem || !offeredItem) {
      const err = new Error("One or both items not found");
      err.statusCode = 404;
      throw err;
    }

    if (requestedItem.status !== "AVAILABLE" || offeredItem.status !== "AVAILABLE") {
      const err = new Error("Both items must be available for swap");
      err.statusCode = 400;
      throw err;
    }

    if (requestedItem.ownerId.toString() === requesterId) {
      const err = new Error("You cannot request a swap for your own item");
      err.statusCode = 400;
      throw err;
    }

    if (offeredItem.ownerId.toString() !== requesterId) {
      const err = new Error("You must offer an item that you own");
      err.statusCode = 400;
      throw err;
    }

    const responderId = requestedItem.ownerId.toString();

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const swap = await Swap.create(
        [
          {
            requesterId: new mongoose.Types.ObjectId(requesterId),
            responderId: new mongoose.Types.ObjectId(responderId),
            requestedItemId: new mongoose.Types.ObjectId(dto.requestedItemId),
            offeredItemId: new mongoose.Types.ObjectId(dto.offeredItemId),
            status: "PENDING"
          }
        ],
        { session }
      );

      const chatRoom = await ChatRoom.create(
        [
          {
            swapId: swap[0]._id
          }
        ],
        { session }
      );

      await session.commitTransaction();

      // Notify responder about new swap request
      await Notification.create({
        userId: responderId,
        type: "swap_request",
        message: "You received a new swap request.",
        link: `/swaps/${swap[0]._id.toString()}`
      });

      return { ...swap[0].toObject(), chatRoomId: chatRoom[0]._id.toString() };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async listForUser(userId) {
    const swaps = await Swap.find({
      $or: [
        { requesterId: new mongoose.Types.ObjectId(userId) },
        { responderId: new mongoose.Types.ObjectId(userId) }
      ]
    })
      .populate("requestedItemId")
      .populate("offeredItemId")
      .sort({ createdAt: -1 });

    return swaps;
  }

  async changeStatus(userId, swapId, newStatus) {
    const swap = await Swap.findById(swapId)
      .populate("requestedItemId")
      .populate("offeredItemId");

    if (!swap) {
      const err = new Error("Swap not found");
      err.statusCode = 404;
      throw err;
    }

    if (newStatus === "ACCEPTED" || newStatus === "REJECTED") {
      if (swap.responderId.toString() !== userId) {
        const err = new Error("Only the owner of the requested item can accept or reject");
        err.statusCode = 403;
        throw err;
      }
      if (swap.status !== "PENDING") {
        const err = new Error("Swap must be pending to accept or reject");
        err.statusCode = 400;
        throw err;
      }
    }

    if (newStatus === "CANCELLED") {
      if (
        swap.requesterId.toString() !== userId &&
        swap.responderId.toString() !== userId
      ) {
        const err = new Error("Only participants can cancel a swap");
        err.statusCode = 403;
        throw err;
      }
      if (swap.status === "COMPLETED") {
        const err = new Error("Cannot cancel a completed swap");
        err.statusCode = 400;
        throw err;
      }
    }

    if (newStatus === "COMPLETED") {
      if (
        swap.requesterId.toString() !== userId &&
        swap.responderId.toString() !== userId
      ) {
        const err = new Error("Only participants can complete a swap");
        err.statusCode = 403;
        throw err;
      }
      if (swap.status !== "ACCEPTED") {
        const err = new Error("Swap must be accepted before completion");
        err.statusCode = 400;
        throw err;
      }
    }

    if (newStatus === "COMPLETED") {
      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        await Swap.findByIdAndUpdate(swapId, { status: "COMPLETED" }, { session });

        await Item.updateMany(
          {
            _id: {
              $in: [
                new mongoose.Types.ObjectId(swap.requestedItemId.toString()),
                new mongoose.Types.ObjectId(swap.offeredItemId.toString())
              ]
            }
          },
          { status: "SWAPPED" },
          { session }
        );

        const points = 10;
        await User.updateMany(
          {
            _id: {
              $in: [
                new mongoose.Types.ObjectId(swap.requesterId.toString()),
                new mongoose.Types.ObjectId(swap.responderId.toString())
              ]
            }
          },
          { $inc: { swapPoints: points } },
          { session }
        );

        await session.commitTransaction();

        const updated = await Swap.findById(swapId);

        // Notify both users about completion
        await Notification.insertMany([
          {
            userId: swap.requesterId,
            type: "swap_completed",
            message: "Your swap has been marked as completed.",
            link: `/swaps/${swapId}`
          },
          {
            userId: swap.responderId,
            type: "swap_completed",
            message: "Your swap has been marked as completed.",
            link: `/swaps/${swapId}`
          }
        ]);

        return updated;
      } catch (error) {
        await session.abortTransaction();
        throw error;
      } finally {
        session.endSession();
      }
    }

    swap.status = newStatus;
    await swap.save();

    // Simple notifications for accepted / rejected / cancelled
    if (newStatus === "ACCEPTED") {
      await Notification.create({
        userId: swap.requesterId,
        type: "swap_accepted",
        message: "Your swap request was accepted.",
        link: `/swaps/${swapId}`
      });
    } else if (newStatus === "REJECTED") {
      await Notification.create({
        userId: swap.requesterId,
        type: "swap_rejected",
        message: "Your swap request was rejected.",
        link: `/swaps/${swapId}`
      });
    }

    return swap;
  }

  accept(userId, swapId) {
    return this.changeStatus(userId, swapId, "ACCEPTED");
  }

  reject(userId, swapId) {
    return this.changeStatus(userId, swapId, "REJECTED");
  }

  cancel(userId, swapId) {
    return this.changeStatus(userId, swapId, "CANCELLED");
  }

  complete(userId, swapId) {
    return this.changeStatus(userId, swapId, "COMPLETED");
  }
}

module.exports = SwapService;
