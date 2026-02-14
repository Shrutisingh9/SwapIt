const { Router } = require("express");
const { z } = require("zod");
const ChatService = require("./chat.service");
const { requireAuth } = require("../../core/auth/authMiddleware");
const { validateRequest } = require("../../core/http/requestValidator");

const router = Router();
const service = new ChatService();

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
