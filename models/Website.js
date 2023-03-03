const mongoose = require("mongoose");
const { Schema } = mongoose;

const Website = new Schema({
  title: { type: String, required: true, unique: true },
  url: { type: String, required: true, unique: true },
  isAccessible: { type: Boolean, default: true, require: true, unique: false },
});

module.exports = mongoose.model("Website", Website);
