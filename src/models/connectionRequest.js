const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["INTERESTED", "IGNORED", "ACCEPTED", "REJECTED"],
        message: "{VALUE} is not a valid status",
      },
    },
  },
  {
    timestamps: true,
  }
);

// Enforce at most one request document per sender/receiver pair.
connectionRequestSchema.index({ senderId: 1, receiverId: 1 }, { unique: true });

//corner case - if sender and receiver are same
connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  if (
    connectionRequest.senderId.toString() ===
    connectionRequest.receiverId.toString()
  ) {
    throw new Error("Sender and receiver cannot be same!");
  }
  next();
});
const connectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);
module.exports = connectionRequestModel;
