const { Router } = require("express");
const Swap = require("../../models/Swap");
const Item = require("../../models/Item");
const User = require("../../models/User");
const { requireAuth } = require("../../core/auth/authMiddleware");

const router = Router();

// Current user's profile + basic stats
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      "email name location avatarUrl bio gender dateOfBirth phone rating ratingCount isVerified swapPoints savedItems"
    );

    if (!user) {
      return res.status(404).json({ error: "NotFound", message: "User not found" });
    }

    const [totalSwaps, totalDonations] = await Promise.all([
      Swap.countDocuments({
        $or: [{ requesterId: user._id }, { responderId: user._id }],
        status: "COMPLETED"
      }),
      Item.countDocuments({
        ownerId: user._id,
        isForDonation: true
      })
    ]);

    res.json({
      user,
      stats: {
        totalSwaps,
        totalDonations
      }
    });
  } catch (err) {
    next(err);
  }
});

// Update current user profile
router.patch("/me", requireAuth, async (req, res, next) => {
  try {
    const { name, location, bio, gender, dateOfBirth, phone } = req.body;
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (location !== undefined) updates.location = location;
    if (bio !== undefined) updates.bio = bio;
    if (gender !== undefined) updates.gender = gender || null;
    if (dateOfBirth !== undefined) updates.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    if (phone !== undefined) updates.phone = phone || null;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select("email name location avatarUrl bio gender dateOfBirth phone rating ratingCount isVerified swapPoints");

    if (!user) return res.status(404).json({ error: "NotFound", message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
});

// Toggle wishlist (add/remove saved item)
router.post("/me/wishlist/:itemId", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const itemId = req.params.itemId;
    const user = await User.findById(userId).select("savedItems");
    if (!user) return res.status(404).json({ error: "NotFound", message: "User not found" });
    const saved = user.savedItems || [];
    const idx = saved.findIndex((id) => id.toString() === itemId);
    if (idx >= 0) {
      saved.splice(idx, 1);
      user.savedItems = saved;
      await user.save();
      return res.json({ saved: false, savedItems: user.savedItems });
    }
    saved.push(itemId);
    user.savedItems = saved;
    await user.save();
    return res.json({ saved: true, savedItems: user.savedItems });
  } catch (err) {
    next(err);
  }
});

// Get saved/wishlist items
router.get("/me/wishlist", requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("savedItems");
    if (!user || !user.savedItems?.length) return res.json([]);
    const items = await Item.find({ _id: { $in: user.savedItems }, status: "AVAILABLE" })
      .populate("ownerId", "name rating location")
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    next(err);
  }
});

// Get current user's items
router.get("/me/items", requireAuth, async (req, res, next) => {
  try {
    const items = await Item.find({ ownerId: req.user.id })
      .sort({ createdAt: -1 })
      .populate("ownerId", "name rating location");
    res.json(items);
  } catch (err) {
    next(err);
  }
});

module.exports = { userRouter: router };

