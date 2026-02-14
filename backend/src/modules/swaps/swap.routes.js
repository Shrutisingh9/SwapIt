const { Router } = require("express");
const SwapService = require("./swap.service");
const { requireAuth } = require("../../core/auth/authMiddleware");
const { validateRequest } = require("../../core/http/requestValidator");
const { createSwapSchema } = require("./swap.dto");

const router = Router();
const service = new SwapService();

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const swaps = await service.listForUser(req.user.id);
    res.json(swaps);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  requireAuth,
  validateRequest(createSwapSchema, "body"),
  async (req, res, next) => {
    try {
      const swap = await service.createSwap(req.user.id, req.body);
      res.status(201).json(swap);
    } catch (err) {
      next(err);
    }
  }
);

router.post("/:id/accept", requireAuth, async (req, res, next) => {
  try {
    const swap = await service.accept(req.user.id, req.params.id);
    res.json(swap);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/reject", requireAuth, async (req, res, next) => {
  try {
    const swap = await service.reject(req.user.id, req.params.id);
    res.json(swap);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/cancel", requireAuth, async (req, res, next) => {
  try {
    const swap = await service.cancel(req.user.id, req.params.id);
    res.json(swap);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/complete", requireAuth, async (req, res, next) => {
  try {
    const swap = await service.complete(req.user.id, req.params.id);
    res.json(swap);
  } catch (err) {
    next(err);
  }
});

module.exports = { swapRouter: router };
