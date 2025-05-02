const mongoose = require("mongoose");
var validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    age: {
      type: Number,
      min: 18,
      max: 99,
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "Not Specified"].includes(value)) {
          throw new Error("Gender is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRIvjlPnrVQyU-f3cotczTkU5eitJUijH4Fng&s",
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid photoURL: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "Hey! I am on Dev Finder.",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = mongoose.model("User", userSchema);

module.exports = {
  UserModel,
};
