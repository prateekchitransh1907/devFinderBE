const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express();
const PORT = 3000;

//request handlers
/*app.use matches all the HTTP methods GET POST PUT PATCH DELETE*/
// app.use("/home/contact", (req, res) => {
//   res.send("Welcome to the contact page");
// });
//a middleware for all the HTTP calls which have /admin in the url
app.use("/admin", adminAuth);

app.get("/user/:userId/:name", userAuth, (req, res) => {
  res.send({ firstName: "Prateek", lastName: "Chitransh" });
});
app.get("/admin/getAllData", (req, res) => {
  res.send({ firstName: "Prateek", lastName: "Chitransh", role: "admin" });
});
app.get("/admin/deleteAllData", (req, res) => {
  res.send("deleted");
});
app.post(
  "/user",
  (req, res, next) => {
    console.log("save user to DB");
    //res.send("User saved to DB!!!");
    next();
  },
  (req, res) => {
    res.send({
      status: "success",
      message: "user in DB saved",
    });
  }
);

app.delete("/user", (req, res) => {
  res.send("Deleted record from DB!!!");
});

app.put("/user", (req, res) => {
  res.send("updated record in DB!!!");
});

app.patch("/user", (req, res) => {
  res.send("patched record in DB!!!");
});
//error handling using middleware - otherwise use try catch
app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log("Listening on PORT", PORT);
});
