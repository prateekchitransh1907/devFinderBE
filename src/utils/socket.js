const socket = require("socket.io");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");
const cookie = require("cookie");
const { Chat } = require("../models/chat");
const connectionRequestModel = require("../models/connectionRequest");

const getRoomId = (user1, user2) => {
  return crypto
    .createHash("sha256")
    .update([user1, user2].sort().join("_"))
    .digest("hex");
};

const onlineUsers = new Map();
const initializeSocket = (server) => {
  console.log("Initializing socket.io server...");
  const io = socket(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers.cookie || "");

      const token = cookies.token;

      if (!token) {
        return next(new Error("Authentication failed"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      const user = await UserModel.findById(decoded._id);

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;

      next();
    } catch (err) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    console.log("New client connected", socket.id);

    //handle incoming messages from clients

    onlineUsers.set(socket.user._id.toString(), socket.id);

    console.log("online users", Array.from(onlineUsers.keys()));

    io.emit("onlineUsers", [...onlineUsers.keys()]);

    socket.on("joinChat", ({ userId }) => {
      const loggedInUserId = socket.user._id.toString();

      console.log(`${socket.user.firstName} joined chat with ${userId}`);

      const room = getRoomId(loggedInUserId, userId);

      socket.join(room);
    });

    socket.on("sendMessage", async ({ userId, text }) => {
      const loggedInUserId = socket.user._id.toString();

      //save message to database here if needed
      try {
        const room = getRoomId(loggedInUserId, userId);

        connectionRequestModel
          .findOne({
            $or: [
              { senderId: loggedInUserId, receiverId: userId },
              { senderId: userId, receiverId: loggedInUserId },
            ],
          })
          .then(async (connectionRequest) => {
            if (!connectionRequest || connectionRequest.status !== "ACCEPTED") {
              console.log("Users are not connected. Message not sent.");
              return;
            }
          });
        //find if there is an existing chat between the two users
        let chat = await Chat.findOne({
          participants: { $all: [loggedInUserId, userId] },
        });
        //if no chat exists create a new chat
        if (!chat) {
          chat = new Chat({
            participants: [loggedInUserId, userId],
            messages: [],
          });
        }

        chat.messages.push({
          senderId: loggedInUserId,
          text,
        });

        await chat.save();

        io.to(room).emit("messageReceived", {
          firstName: socket.user.firstName,
          senderId: loggedInUserId,
          text,
          createdAt: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Error saving message:", error);
      }
    });
    socket.on("disconnect", () => {
      console.log("Client disconnected", socket.id);
      onlineUsers.delete(socket.user._id.toString());
      io.emit("onlineUsers", [...onlineUsers.keys()]);
    });
  });
};

module.exports = {
  initializeSocket,
};
