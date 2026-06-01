const express = require("express");
const { userAuth } = require("../middlewares/auth");
const connectionRequestModel = require("../models/connectionRequest");
const { UserModel } = require("../models/user");

const connectionRouter = express.Router();

//email
const sendEmail = require("../utils/sendEmail");

//send connection request
connectionRouter.post(
  "/request/send/:status/:receiverId",
  userAuth,
  async (req, res) => {
    //send connection request to user

    try {
      const senderId = req.user._id;
      const receiverId = req.params.receiverId;
      const status = req.params.status;
      const allowedStatus = ["INTERESTED", "IGNORED"];
      if (!allowedStatus.includes(status.toUpperCase())) {
        return res.status(400).json({
          statusCode: 400,
          errorStatus: "INVALID_STATUS",
          message: "Invalid status type:" + status,
        });
      } //corner case - check if a request is already sent by the sender to receiver and its pending
      const existingRequest = await connectionRequestModel.findOne({
        $or: [
          { senderId: senderId, receiverId: receiverId },
          { senderId: receiverId, receiverId: senderId },
        ],
      });
      if (existingRequest) {
        return res.status(400).json({
          statusCode: 400,
          errorStatus: "REQUEST_ALREADY_SENT",
          message: "Connection request is already sent to this user!",
        });
      } //corner case - if receiver is not registered user
      const isReceiverValid = await UserModel.findById(receiverId);
      if (!isReceiverValid) {
        return res.status(404).json({
          statusCode: 404,
          errorStatus: "USER_NOT_FOUND",
          message: "The user you are trying to connect with does not exist!",
        });
      }
      const connectionRequest = new connectionRequestModel({
        senderId,
        receiverId,
        status: status.toUpperCase(),
      });
      const data = await connectionRequest.save();
      const senderName = `${req.user.firstName} ${req.user.lastName}`;

      const emailRes = await sendEmail.run({
        toAddress: "prateekchitransh@gmail.com",
        fromAddress: "updates@dev-finder.com",
        senderName: `${req.user.firstName} ${req.user.lastName}`,
        senderHeadline: req.user.about,
        profileLink: `https://dev-finder.com/profile/${senderId}`,
      });
      console.log("Email response:", emailRes);
      res.json({
        message: "User action on the request: " + status.toUpperCase(),
        data: data,
      });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  }
);

connectionRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    //respond to connection request
    try {
      const loggedInUser = req.user;
      const { status, requestId } = req.params;
      const allowedStatus = ["ACCEPTED", "REJECTED"];
      if (!allowedStatus.includes(status.toUpperCase())) {
        return res.status(400).json({
          statusCode: 400,
          errorStatus: "INVALID_STATUS",
          message: "Invalid status!",
        });
      }
      const connectionRequest = await connectionRequestModel.findOne({
        _id: requestId,
        receiverId: loggedInUser._id,
        status: "INTERESTED",
      });
      if (!connectionRequest) {
        return res.status(404).json({
          statusCode: 404,
          errorStatus: "REQUEST_NOT_FOUND",
          message: "Connection request not found!",
        });
      }
      connectionRequest.status = status.toUpperCase();
      const data = await connectionRequest.save();
      res.json({
        message: "User action on the request: " + status.toUpperCase(),
        data: data,
      });
    } catch (error) {
      res.status(400).send("Error: " + error.message);
    }
  }
);

module.exports = connectionRouter;
