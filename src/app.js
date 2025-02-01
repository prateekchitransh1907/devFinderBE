const express = require("express");
const { connectDB } = require("./config/database");
const { UserModel } = require("./models/user");
const app = express();
const PORT = 3000;

app.post("/signup", async (req, res) => {
  //creating a new instance of user model
  const user = new UserModel({
    firstName: "KL",
    lastName: "Rahul",
    emailId: "rahul.kl@gmail.com",
    password: "rahul",
  });
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
connectDB()
  .then(() => {
    console.log("<====== Database connection established ====>");
    app.listen(PORT, () => {
      console.log("Listening on PORT", PORT);
    });
  })
  .catch((err) => console.error("Database connection failed "));
