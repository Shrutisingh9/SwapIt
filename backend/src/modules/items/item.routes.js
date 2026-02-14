const { Router } = require("express");
const { z } = require("zod");
const ItemService = require("./item.service");
const { validateRequest } = require("../../core/http/requestValidator");
const { createItemSchema, updateItemSchema } = require("./item.dto");
const { requireAuth } = require("../../core/auth/authMiddleware");

const router = Router();
const service = new ItemService();

router.get(
  "/",
  validateRequest(
    z.object({
      q: z.string().optional(),
      category: z.string().optional(),
      // type = "swap" | "donation" to filter swap vs donation items
      type: z.string().optional()
    }),
    "query"
  ),
  async (req, res, next) => {
    try {
      const items = await service.listAvailable(req.query);
      res.json(items);
    } catch (err) {
      next(err);
    }
  }
);

router.get("/:id", async (req, res, next) => {
  try {
    const item = await service.getByIdPublic(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  requireAuth,
  validateRequest(createItemSchema, "body"),
  async (req, res, next) => {
    try {
      const item = await service.create(req.user.id, req.body);
      res.status(201).json(item);
    } catch (err) {
      next(err);
    }
  }
);

router.patch(
  "/:id",
  requireAuth,
  validateRequest(updateItemSchema, "body"),
  async (req, res, next) => {
    try {
      const item = await service.update(req.user.id, req.params.id, req.body);
      res.json(item);
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    await service.delete(req.user.id, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = { itemRouter: router };
