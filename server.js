const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const job = require("./scheludeTask");

const app = express();
app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());

//routes
const authRouter = require("./routes/auth/authRouter");
const webRouter = require("./routes/website/webRouter");
const userRouter = require("./routes/user/userRouter");
const adminRouter = require("./routes/admin/adminRouter");
app.get("/", (req, res) => res.json({ succes: true }));
app.use("/api/auth", authRouter);
app.use("/api/website", webRouter);
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose.connect(process.env.DB_URI);
    console.log("server started on port", PORT);
    console.log("db connected");
  } catch (error) {
    console.log(error);
  }
});
