const { Router } = require("express");
const { z } = require("zod");
const Ngo = require("../../models/Ngo");
const { requireAuth } = require("../../core/auth/authMiddleware");
const { validateRequest } = require("../../core/http/requestValidator");

const router = Router();

// Public: list active NGOs (used on Add Item / Donation flows)
router.get("/", async (req, res, next) => {
  try {
    const ngos = await Ngo.find({ isActive: true }).sort({ name: 1 });
    res.json(ngos);
  } catch (err) {
    next(err);
  }
});

// Simple admin check based on user.isAdmin flag
function requireAdmin(req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ error: "Forbidden", message: "Admin only" });
  }
  next();
}

const ngoSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  categories: z.array(z.string()).optional(),
  contactEmail: z.string().email().optional(),
  website: z.string().url().optional(),
  isActive: z.boolean().optional()
});

// Admin: create NGO
router.post(
  "/",
  requireAuth,
  requireAdmin,
  validateRequest(ngoSchema, "body"),
  async (req, res, next) => {
    try {
      const ngo = await Ngo.create(req.body);
      res.status(201).json(ngo);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = { ngoRouter: router };

