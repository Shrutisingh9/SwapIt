const { Router } = require("express");
const { z } = require("zod");
const RatingService = require("./rating.service");
const { requireAuth } = require("../../core/auth/authMiddleware");
const { validateRequest } = require("../../core/http/requestValidator");

const router = Router();
const service = new RatingService();

router.post(
  "/swaps/:swapId",
  requireAuth,
  validateRequest(
    z.object({
      score: z.number().int().min(1).max(5)
    }),
    "body"
  ),
  async (req, res, next) => {
    try {
      const rating = await service.rateUser(
        req.user.id,
        req.params.swapId,
        req.body.score
      );
      res.status(201).json(rating);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = { ratingRouter: router };
