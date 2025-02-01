const express = require("express");

const app = express();
const PORT = 3000;

//request handlers
app.use("/home", (req, res) => {
  res.send("Welcome to the home page");
});

app.use("", (req, res) => {
  res.send("Welcome to the dashboard page");
});

app.listen(PORT, () => {
  console.log("Listening on PORT", PORT);
});
