const mongoose = require("mongoose");
const { Schema } = mongoose;

const Request = new Schema({
  title: { type: String, required: true, unique: true },
  url: { type: String, required: true, unique: true },
  from: { type: String, required: true },
  date: { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Request", Request);
