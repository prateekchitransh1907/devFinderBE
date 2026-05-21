const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();
const connectionRequestModel = require("../models/connectionRequest");
const mongoose = require("mongoose");
const { UserModel } = require("../models/user");
//get all pendingrequests for logged in user
const user_safe_data = "firstName lastName about skills";
userRouter.get("/user/requests/pending", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const pendingRequests = await connectionRequestModel
      .find({
        receiverId: loggedInUser._id,
        status: "INTERESTED",
      })
      .populate("senderId", user_safe_data);
    res.json({ pendingRequests });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});
//get user connections which are accepted by both parties
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connections = await connectionRequestModel
      .find({
        $or: [
          { senderId: loggedInUser._id, status: "ACCEPTED" },
          { receiverId: loggedInUser._id, status: "ACCEPTED" },
        ],
      })
      .populate("senderId", user_safe_data)
      .populate("receiverId", user_safe_data);
    const data = connections.map((connection) => {
      if (connection.senderId._id.toString() === loggedInUser._id.toString()) {
        return { connectionId: connection._id, user: connection.receiverId };
      } else {
        return { connectionId: connection._id, user: connection.senderId };
      }
    });
    res.send({ connections: data });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

//get user feed - get all users except logged in user
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user; //cases for having feed api //1. show all users except logged in user //2. show only those users who user has not sent request - interested //3. Don't show accepted connections in feed //find all connection requests where logged in user has sent INTERESTED requests or has ACCEPTED connections
    const connectionRequests = await connectionRequestModel
      .find({
        $or: [
          { senderId: loggedInUser._id, status: "INTERESTED" },
          { senderId: loggedInUser._id, status: "ACCEPTED" },
          { receiverId: loggedInUser._id, status: "ACCEPTED" },
        ],
      })
      .select("senderId receiverId"); //create a unique set of userIds (as ObjectId) to be hidden from feed
    const hideUsersFromFeed = new Set(); //add logged in user to hideUsersFromFeed
    hideUsersFromFeed.add(loggedInUser._id.toString()); //add all receiver/sender ids from requests to the set
    connectionRequests.forEach((request) => {
      if (request.senderId.toString() === loggedInUser._id.toString()) {
        hideUsersFromFeed.add(request.receiverId.toString());
      } else {
        hideUsersFromFeed.add(request.senderId.toString());
      }
    }); //convert string IDs to ObjectIds for MongoDB query
    const hideUsersObjectIds = Array.from(hideUsersFromFeed).map(
      (id) => new mongoose.Types.ObjectId(id)
    ); //build query
    let query = UserModel.find({
      _id: { $nin: hideUsersObjectIds },
    })
      .select(user_safe_data)
      .sort({ createdAt: -1 }); //optional pagination - only apply if page and limit are provided
    if (req.query.page && req.query.limit) {
      const page = parseInt(req.query.page) || 1;
      let limit = parseInt(req.query.limit) || 10;
      limit = limit > 50 ? 50 : limit; //maximum limit is 50
      const skip = (page - 1) * limit;
      query = query.skip(skip).limit(limit);
    }
    const feedUsers = await query;
    res.send({ feedUsers });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = userRouter;
