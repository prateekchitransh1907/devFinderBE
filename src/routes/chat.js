const express = require("express");
const { Chat } = require("../models/chat");
const { userAuth } = require("../middlewares/auth");

const chatRouter = express.Router();

chatRouter.get("/chat/:userId", userAuth, async (req, res) => {
  const { userId } = req.params;

  const loggedInUserId = req.user._id;

  // Validate the input
  try {
    let chat = await Chat.findOne({
      participants: { $all: [loggedInUserId, userId] },
    }).populate({
      path: "messages.senderId",
      select: "firstName lastName",
    });

    if (!chat) {
      chat = new Chat({
        participants: [loggedInUserId, userId],
        messages: [],
      });

      await chat.save();
    }

    res.json(chat);
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = chatRouter;
