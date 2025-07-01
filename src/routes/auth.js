const express = require("express");

const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const { UserModel } = require("../models/user");
const bcrypt = require("bcrypt");
authRouter.post("/signup", async (req, res) => {
  //validation of data received from user
  //Encrypt the password

  //creating a new instance of user model
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password, about, skills, age } =
      req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);
    const user = new UserModel({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      about,
      skills,
      age,
    });

    await user.save();
    res.send("user added successfully");
  } catch (err) {
    console.log("Error==>", err);
    res.status(400).send({
      message: "ERR: " + err.message,
    });
  }
});

//login API

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const loginUser = await UserModel.findOne({ emailId: emailId });

    if (!loginUser) {
      throw new Error("Invalid Credentials!");
    } else {
      const dbPassword = loginUser.password;
      const isPasswordValid = await loginUser.validatePassword(password);
      if (isPasswordValid) {
        //generate a jwt
        const token = await loginUser.getJWT();
        console.log(token);
        // add the jwt to cookie

        //send back the cookie  in response
        res.cookie("token", token, {
          expires: new Date(Date.now() + 8 * 3600000), // cookie will be removed after 8 hours
        });
        res.send("Login successful");
      } else {
        throw new Error("Invalid Credentials!");
      }
    }

    await loginUser.save();
  } catch (err) {
    console.log("Error==>", err);
    res.status(400).send({
      message: "ERR: " + err.message,
    });
  }
});

module.exports = authRouter;
