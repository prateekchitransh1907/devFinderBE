const mongooose = require("mongoose");

const messageSchema = new mongooose.Schema(
  {
    senderId: {
      type: mongooose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const chatSchema = new mongooose.Schema(
  {
    participants: [
      {
        type: mongooose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

const Chat = mongooose.model("Chat", chatSchema);

module.exports = { Chat };
