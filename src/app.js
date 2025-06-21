const express = require("express");
const { connectDB } = require("./config/database");
const { UserModel } = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(cookieParser());
app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const loginUser = await UserModel.findOne({ emailId: emailId });

    if (!loginUser) {
      throw new Error("Invalid Credentials!");
    } else {
      const dbPassword = loginUser.password;
      const isPasswordValid = await bcrypt.compare(password, dbPassword);
      if (isPasswordValid) {
        //generate a jwt
        const token = await jwt.sign({ _id: loginUser._id }, "Dev@finder9009", {
          expiresIn: "1h",
        });
        console.log(token);
        // add the jwt to cookie

        //send back the cookie  in response
        res.cookie("token", token);
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

//GET API for fetching User by EmailId

app.get("/user", async (req, res) => {
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
app.get("/profile", userAuth, async (req, res) => {
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

//send connection request
app.post("/sendConnectionRequest", userAuth, (req, res) => {
  //send connection request to user
  const user = req.user;

  res.send("Connection request sent from " + user.firstName);
});
//Feed API - Get all users
app.get("/feed", async (req, res) => {
  try {
    const users = await UserModel.find({});
    res.send(users);
  } catch (error) {
    res.status(400).send("Something went worng!");
  }
});
//DELETE user API - delete a user
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const result = await UserModel.findByIdAndDelete(userId);
    if (!result) {
      res
        .status(404)
        .send("User has been already deleted or id doesnt exist!!");
    }
    res.send("User with emailID: " + result.emailId + " is deleted!");
  } catch (error) {
    res.status(400).send("something went wrong!");
  }
});
//UPDATE user API - update user details
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;
  console.log(data);
  try {
    const ALLOWED_UPDATES = ["skills", "photoUrl", "about", "password"];
    const isAllowed = Object.keys(data).every((k) => {
      console.log(k);
      return ALLOWED_UPDATES.includes(k);
    });
    if (!isAllowed) {
      throw new Error("Cannot allow update!");
    }
    if (data.skills.length > 5) {
      throw new Error("Maximum number of skills should be 5");
    }
    const results = await UserModel.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(results);

    res.send("Updated user data successfully");
  } catch (error) {
    res.status(400).send("Something went wrong !!!" + error.message);
  }
});
connectDB()
  .then(() => {
    console.log("<====== Database connection established ====>");
    app.listen(PORT, () => {
      console.log("Listening on PORT", PORT);
    });
  })
  .catch((err) => console.error("Database connection failed "));
