const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRouter = require("./routes/connection");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user");

const app = express();
const PORT = 3000;
const corsOptions = {
  origin: true,
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("<====== Database connection established ====>");
    app.listen(PORT, () => {
      console.log("Listening on PORT", PORT);
    });
  })
  .catch((err) => console.error("Database connection failed "));
