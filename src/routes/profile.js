const express = require("express");

const profileRouter = express.Router();
const { UserModel } = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const { validateProfileEditData } = require("../utils/validation");

//profile view API
profileRouter.get("/profile/view", userAuth, async (req, res) => {
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

//profile edit API
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateProfileEditData(req)) {
      throw new Error("Invalid data for profile edit!");
    }
    const loggedInUser = req.user;
    console.log(loggedInUser);
    const data = req.body;
    console.log(data);
    if (data.skills && data.skills.length > 5) {
      throw new Error("Maximum number of skills should be 5");
    } else if (data.password) {
      const bcrypt = require("bcrypt");
      data.password = await bcrypt.hash(data.password, 10);
    }
    Object.keys(data).forEach((k) => {
      loggedInUser[k] = data[k];
    });
    await loggedInUser.save();
    res.json({
      message: `${loggedInUser.firstName}'s profile is updated!`,
      data: loggedInUser,
    });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});

module.exports = profileRouter;
