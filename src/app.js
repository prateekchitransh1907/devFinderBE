const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
require("../src/cron/weeklyDigest");
const { connectDB } = require("./config/database");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRouter = require("./routes/connection");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const { initializeSocket } = require("./utils/socket");
const chatRouter = require("./routes/chat");
const uploadRouter = require("./routes/uploadFiles");

const app = express();
const PORT = process.env.PORT;
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
app.use("/", paymentRouter);
app.use("/", chatRouter);
app.use("/", uploadRouter);

const server = http.createServer(app);
initializeSocket(server);

connectDB()
  .then(() => {
    console.log("<====== Database connection established ====>");
    server.listen(PORT, () => {
      console.log("Listening on PORT", PORT);
    });
  })
  .catch((err) => console.error("Database connection failed "));
