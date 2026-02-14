const { z } = require("zod");

const createSwapSchema = z.object({
  requestedItemId: z.string(),
  offeredItemId: z.string()
});

module.exports = { createSwapSchema };
