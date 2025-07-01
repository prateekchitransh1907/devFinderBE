const express = require("express");

const profileRouter = express.Router();
const { UserModel } = require("../models/user");
const { userAuth } = require("../middlewares/auth");

//GET API for fetching User by EmailId

profileRouter.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const users = await UserModel.find({
      emailId: userEmail,
    });
    if (users.length === 0) {
      res.status(404).send("Users not found !");
    }
    res.send(users);
  } catch (error) {
    res.status(400).send("something went wrong !!");
  }
});

//profile API
profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    console.log("Error==>", err);
    res.status(400).send({
      message: "ERR: " + err.message,
    });
  }
});

module.exports = profileRouter;
