const { z } = require("zod");

const createItemSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(1),
  condition: z.enum(["NEW", "GOOD", "USED", "POOR"]),
  location: z.string().optional(),
  tags: z.array(z.string()).optional(),
  imageUrls: z.array(
    z.union([
      z.string().url(),
      z.string().regex(/^data:image\/[a-zA-Z0-9+-]+;base64,/)
    ])
  ).min(1),
  // Swap / donation flags from frontend
  isForSwap: z.boolean().optional(),
  isForDonation: z.boolean().optional(),
  ngoId: z.string().optional().nullable()
});

const updateItemSchema = createItemSchema
  .omit({ imageUrls: true })
  .partial();

module.exports = { createItemSchema, updateItemSchema };
