const { Router } = require("express");
const Notification = require("../../models/Notification");
const { requireAuth } = require("../../core/auth/authMiddleware");

const router = Router();

// Get notifications for current user
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  } catch (err) {
    next(err);
  }
});

// Mark all as read
router.post("/read-all", requireAuth, async (req, res, next) => {
  try {
    await Notification.updateMany(
      { userId: req.user.id, isRead: false },
      { isRead: true }
    );
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = { notificationRouter: router };

