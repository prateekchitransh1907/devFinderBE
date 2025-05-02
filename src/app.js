const express = require("express");
const { connectDB } = require("./config/database");
const { UserModel } = require("./models/user");
const app = express();
const PORT = 3000;
app.use(express.json());
app.post("/signup", async (req, res) => {
  //creating a new instance of user model
  const user = new UserModel(req.body);
  try {
    await user.save();
    res.send("user added successfully");
  } catch (err) {
    console.log("Error==>", err);
    res.status(400).send({
      message: "Error in creating user: " + err.message,
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
