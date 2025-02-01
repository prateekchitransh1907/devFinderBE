const express = require("express");

const app = express();
const PORT = 3000;

//request handlers
/*app.use matches all the HTTP methods GET POST PUT PATCH DELETE*/
// app.use("/home/contact", (req, res) => {
//   res.send("Welcome to the contact page");
// });

app.get("/user/:userId/:name", (req, res) => {
  console.log(req.query);
  console.log(req.params);
  res.send({ firstName: "Prateek", lastName: "Chitransh" });
});

app.post("/user", (req, res) => {
  console.log("save user to DB");
  res.send("User saved to DB!!!");
});

app.delete("/user", (req, res) => {
  res.send("Deleted record from DB!!!");
});

app.put("/user", (req, res) => {
  res.send("updated record in DB!!!");
});

app.patch("/user", (req, res) => {
  res.send("patched record in DB!!!");
});

app.use("/home", (req, res) => {
  res.send("Welcome to the home page");
});

// app.use("", (req, res) => {
//   res.send("Welcome to the dashboard page");
// });

app.listen(PORT, () => {
  console.log("Listening on PORT", PORT);
});
