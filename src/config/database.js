const url =
  "mongodb+srv://prateekchitransh:kgz6L5BBpP39MVQz@namastedev.9a4rq.mongodb.net/devFinder";

const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(url, {});
};

module.exports = {
  connectDB,
};
