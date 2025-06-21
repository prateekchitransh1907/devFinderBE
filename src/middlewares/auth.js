const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");

const userAuth = async (req, res, next) => {
  //read the cookie from req
  try {
    const cookie = req.cookies;

    console.log("cookie", cookie);

    const { token } = cookie;
    if (!token) throw new Error("Invalid token"); //verify the token is valid or not
    const decodedMessage = await jwt.verify(token, "Dev@finder9009");
    //find the user  exists in db or not
    console.log(decodedMessage);
    const { _id } = decodedMessage;
    console.log("logged in user is " + _id);
    const user = await UserModel.findById(_id);
    if (!user) throw new Error("User not found");
    console.log(user);
    req.user = user;
    next();
  } catch (err) {
    res.status(400).send({
      message: "ERR: " + err.message,
    });
  }
};

module.exports = {
  userAuth,
};
