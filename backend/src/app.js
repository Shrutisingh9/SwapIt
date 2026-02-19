const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { errorHandler } = require("./core/http/errorHandler");
const { notFoundHandler } = require("./core/http/notFoundHandler");

const { authRouter } = require("./modules/auth/auth.routes");
const { itemRouter } = require("./modules/items/item.routes");
const { swapRouter } = require("./modules/swaps/swap.routes");
const { chatRouter } = require("./modules/chat/chat.routes");
const { ratingRouter } = require("./modules/ratings/rating.routes");
const { ngoRouter } = require("./modules/ngos/ngo.routes");
const { notificationRouter } = require("./modules/notifications/notification.routes");
const { reportRouter } = require("./modules/reports/report.routes");
const { userRouter } = require("./modules/users/user.routes");

function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true
    })
  );
  app.use(express.json({ limit: "10mb" }));
  app.use(morgan("dev"));

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/items", itemRouter);
  app.use("/api/v1/swaps", swapRouter);
  app.use("/api/v1/chat", chatRouter);
  app.use("/api/v1/ratings", ratingRouter);
  app.use("/api/v1/ngos", ngoRouter);
  app.use("/api/v1/notifications", notificationRouter);
  app.use("/api/v1/reports", reportRouter);
  app.use("/api/v1/users", userRouter);

  // Serve frontend static files when deployed together (e.g. Render)
  const fs = require("fs");
  const frontendBuild = path.join(__dirname, "../../frontend/build");
  if (fs.existsSync(frontendBuild)) {
    app.use(express.static(frontendBuild));
    app.get("*", (req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      res.sendFile(path.join(frontendBuild, "index.html"));
    });
  }
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
