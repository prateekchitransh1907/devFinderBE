const express = require("express");
const { userAuth } = require("../middlewares/auth");

const connectionRouter = express.Router();

//send connection request
connectionRouter.post("/sendConnectionRequest", userAuth, (req, res) => {
  //send connection request to user
  const user = req.user;

  res.send("Connection request sent from " + user.firstName);
});

module.exports = connectionRouter;
