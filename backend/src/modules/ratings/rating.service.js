const mongoose = require("mongoose");
const Rating = require("../../models/Rating");
const Swap = require("../../models/Swap");
const User = require("../../models/User");

class RatingService {
  async rateUser(raterId, swapId, score) {
    if (score < 1 || score > 5) {
      const err = new Error("Score must be between 1 and 5");
      err.statusCode = 400;
      throw err;
    }

    const swap = await Swap.findById(swapId);

    if (!swap) {
      const err = new Error("Swap not found");
      err.statusCode = 404;
      throw err;
    }

    if (swap.status !== "COMPLETED") {
      const err = new Error("You can only rate after the swap has been completed");
      err.statusCode = 400;
      throw err;
    }

    if (
      swap.requesterId.toString() !== raterId &&
      swap.responderId.toString() !== raterId
    ) {
      const err = new Error("Only participants in the swap can rate each other");
      err.statusCode = 403;
      throw err;
    }

    const toUserId =
      swap.requesterId.toString() === raterId
        ? swap.responderId.toString()
        : swap.requesterId.toString();

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const rating = await Rating.create(
        [
          {
            fromUserId: new mongoose.Types.ObjectId(raterId),
            toUserId: new mongoose.Types.ObjectId(toUserId),
            swapId: new mongoose.Types.ObjectId(swapId),
            score
          }
        ],
        { session }
      );

      const toUser = await User.findById(toUserId).session(session);

      if (toUser) {
        const newCount = toUser.ratingCount + 1;
        const newAvg = (toUser.rating * toUser.ratingCount + score) / newCount;

        await User.findByIdAndUpdate(
          toUserId,
          {
            rating: newAvg,
            ratingCount: newCount
          },
          { session }
        );
      }

      await session.commitTransaction();

      return rating[0];
    } catch (error) {
      await session.abortTransaction();
      if (error.code === 11000) {
        const err = new Error("You have already rated this swap");
        err.statusCode = 400;
        throw err;
      }
      throw error;
    } finally {
      session.endSession();
    }
  }
}

module.exports = RatingService;
