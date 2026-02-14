const mongoose = require("mongoose");
const Item = require("../../models/Item");
const User = require("../../models/User");

class ItemService {
  async create(ownerId, dto) {
    const item = await Item.create({
      ownerId: new mongoose.Types.ObjectId(ownerId),
      title: dto.title,
      description: dto.description,
      category: dto.category,
      condition: dto.condition,
      location: dto.location,
      status: "AVAILABLE",
      isForSwap: dto.isForSwap !== undefined ? dto.isForSwap : true,
      isForDonation: dto.isForDonation === true,
      ngoId: dto.isForDonation && dto.ngoId ? new mongoose.Types.ObjectId(dto.ngoId) : null,
      tags: dto.tags || [],
      images: dto.imageUrls.map((url, index) => ({ url, order: index }))
    });

    await item.populate({
      path: "ownerId",
      select: "name rating ratingCount location",
      model: User
    });

    return item;
  }

  async listAvailable(query) {
    const { q, category, type } = query;
    const filter = { status: "AVAILABLE" };

    if (category) {
      filter.category = category;
    }

    // type can be "swap", "donation" or undefined for all
    if (type === "swap") {
      filter.isForSwap = true;
    }
    if (type === "donation") {
      filter.isForDonation = true;
    }

    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } }
      ];
    }

    const items = await Item.find(filter)
      .populate({
        path: "ownerId",
        select: "name rating ratingCount location",
        model: User
      })
      .sort({ createdAt: -1 });

    return items;
  }

  async getByIdPublic(id) {
    const item = await Item.findById(id).populate({
      path: "ownerId",
      select: "name rating ratingCount location",
      model: User
    });

    if (!item || item.status !== "AVAILABLE") {
      const err = new Error("Item not found");
      err.statusCode = 404;
      throw err;
    }

    return item;
  }

  async update(ownerId, itemId, dto) {
    const item = await Item.findOne({
      _id: itemId,
      ownerId: new mongoose.Types.ObjectId(ownerId)
    });

    if (!item) {
      const err = new Error("Item not found or not owned by user");
      err.statusCode = 404;
      throw err;
    }

    Object.assign(item, dto);
    await item.save();

    return item;
  }

  async delete(ownerId, itemId) {
    const item = await Item.findOne({
      _id: itemId,
      ownerId: new mongoose.Types.ObjectId(ownerId)
    });

    if (!item) {
      const err = new Error("Item not found or not owned by user");
      err.statusCode = 404;
      throw err;
    }

    item.status = "ARCHIVED";
    await item.save();
  }
}

module.exports = ItemService;
