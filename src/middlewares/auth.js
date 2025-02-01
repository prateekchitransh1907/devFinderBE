const adminAuth = (req, res, next) => {
  console.log("Admin auth check!");
  const token = "xyz";
  const isAuthorized = token === "xyz";
  if (!isAuthorized) {
    res.status(401).send({
      status: "401",
      message: "Unauthorized Request",
    });
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  console.log("User auth check!");
  const token = "xyz";
  const isAuthorized = token === "xyz";
  if (!isAuthorized) {
    res.status(401).send({
      status: "401",
      message: "Unauthorized Request",
    });
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
