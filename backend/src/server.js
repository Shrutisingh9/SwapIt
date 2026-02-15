const http = require("http");
const path = require("path");
const { Server: SocketIOServer } = require("socket.io");
const { createApp } = require("./app");
const { env } = require("./config/env");
const { connectDB, disconnectDB } = require("./config/db");
const { verifyAccessToken } = require("./core/auth/jwtService");
const ChatService = require("./modules/chat/chat.service");

async function bootstrap() {
  await connectDB();

  const app = createApp();
  const server = http.createServer(app);

  // ==============================
  // ✅ SOCKET.IO SETUP
  // ==============================
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  const chatService = new ChatService();

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const payload = verifyAccessToken(token);
      socket.user = { id: payload.sub, email: payload.email };

      return next();
    } catch {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.user;

    socket.on("joinRoom", async (roomId) => {
      try {
        await chatService.listMessages(user.id, roomId);
        socket.join(roomId);
      } catch {
        socket.emit("error", "Cannot join room");
      }
    });

    socket.on("sendMessage", async (data) => {
      try {
        const msg = await chatService.createMessage(
          user.id,
          data.roomId,
          data.body
        );

        io.to(data.roomId).emit("newMessage", msg);
      } catch {
        socket.emit("error", "Cannot send message");
      }
    });
  });

  // ==============================
  // ✅ SERVE REACT FRONTEND (PRODUCTION)
  // ==============================
  const buildPath = require("path").join(process.cwd(), "../frontend/build");
  
  app.use(require("express").static(buildPath));
  
  app.get("*", (req, res) => {
    res.sendFile(require("path").join(buildPath, "index.html"));
  });


  // ==============================
  // ✅ START SERVER
  // ==============================
  const port = process.env.PORT || 4000;

  server.listen(port, () => {
    console.log(`SwapIt API and WebSocket server listening on port ${port}`);
  });

  // ==============================
  // ✅ GRACEFUL SHUTDOWN
  // ==============================
  const shutdown = async () => {
    console.log("Shutting down server...");
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

bootstrap().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});