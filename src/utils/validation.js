const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid!");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter a  strong password!");
  }
};

const validateProfileEditData = (req) => {
  const allowedEditFields = ["skills", "photoUrl", "about", "password"];
  const isAllowed = Object.keys(req.body).every((k) => {
    return allowedEditFields.includes(k);
  });
  if (!isAllowed) {
    return false;
  } // Validate password if it's being updated
  if (req.body.password && !validator.isStrongPassword(req.body.password)) {
    throw new Error("Please enter a strong password!");
  }
  return true;
};
module.exports = {
  validateSignUpData,
  validateProfileEditData,
};
