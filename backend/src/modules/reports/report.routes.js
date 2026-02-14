const { Router } = require("express");
const { z } = require("zod");
const Report = require("../../models/Report");
const { requireAuth } = require("../../core/auth/authMiddleware");
const { validateRequest } = require("../../core/http/requestValidator");

const router = Router();

const createReportSchema = z.object({
  targetUserId: z.string().optional(),
  targetItemId: z.string().optional(),
  targetSwapId: z.string().optional(),
  reason: z.string().min(3),
  details: z.string().optional()
});

router.post(
  "/",
  requireAuth,
  validateRequest(createReportSchema, "body"),
  async (req, res, next) => {
    try {
      const { targetUserId, targetItemId, targetSwapId, reason, details } = req.body;
      const report = await Report.create({
        reporterId: req.user.id,
        targetUserId: targetUserId || null,
        targetItemId: targetItemId || null,
        targetSwapId: targetSwapId || null,
        reason,
        details
      });
      res.status(201).json(report);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = { reportRouter: router };

