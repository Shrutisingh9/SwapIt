const mongoose = require("mongoose");
const { env } = require("./env");

async function connectDB() {
  try {
    await mongoose.connect(env.DATABASE_URL);
    console.log("✅ MongoDB connected successfully");

    // Drop legacy indexes that conflict with current schema
    try {
      const Item = mongoose.connection.collection("items");
      const indexes = await Item.indexes();
      const geoIndex = indexes.find((i) => i.key?.location === "2dsphere");
      if (geoIndex) {
        await Item.dropIndex(geoIndex.name);
        console.log("✅ Dropped legacy geo index on items.location");
      }
    } catch (e) {
      /* ignore */
    }

    // Drop legacy indexes on users
    try {
      const users = mongoose.connection.collection("users");
      const userIndexes = await users.indexes();
      const usernameIndex = userIndexes.find((i) => i.name === "username_1");
      if (usernameIndex) {
        await users.dropIndex("username_1");
        console.log("✅ Dropped legacy username index on users");
      }
      const geoIndex = userIndexes.find((i) => i.key?.location === "2dsphere");
      if (geoIndex) {
        await users.dropIndex(geoIndex.name);
        console.log("✅ Dropped legacy geo index on users.location");
      }
    } catch (e) {
      /* ignore */
    }
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}

async function disconnectDB() {
  await mongoose.disconnect();
}

module.exports = { connectDB, disconnectDB };
