const { Router } = require("express");
const { z } = require("zod");
const ChatService = require("./chat.service");
const { requireAuth } = require("../../core/auth/authMiddleware");
const { validateRequest } = require("../../core/http/requestValidator");

const router = Router();
const service = new ChatService();

// Get or create direct chat room (from item page)
router.post(
  "/direct",
  requireAuth,
  validateRequest(
    z.object({
      otherUserId: z.string().min(1),
      itemId: z.string().optional()
    }),
    "body"
  ),
  async (req, res, next) => {
    try {
      const room = await service.getOrCreateDirectRoom(
        req.user.id,
        req.body.otherUserId,
        req.body.itemId
      );
      res.json(room);
    } catch (err) {
      next(err);
    }
  }
);

// Delete contact (one-way: removes from my list only)
router.delete("/contacts/:contactId", requireAuth, async (req, res, next) => {
  try {
    await service.deleteContact(req.user.id, req.params.contactId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// List conversations (swaps + direct) for current user
router.get("/conversations", requireAuth, async (req, res, next) => {
  try {
    const conversations = await service.listConversations(req.user.id);
    res.json(conversations);
  } catch (err) {
    next(err);
  }
});

router.get("/rooms/:roomId/messages", requireAuth, async (req, res, next) => {
  try {
    const messages = await service.listMessages(req.user.id, req.params.roomId);
    res.json(messages);
  } catch (err) {
    next(err);
  }
});

router.post(
  "/rooms/:roomId/messages",
  requireAuth,
  validateRequest(
    z.object({
      body: z.string().min(1)
    }),
    "body"
  ),
  async (req, res, next) => {
    try {
      const message = await service.createMessage(
        req.user.id,
        req.params.roomId,
        req.body.body
      );
      res.status(201).json(message);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = { chatRouter: router };
