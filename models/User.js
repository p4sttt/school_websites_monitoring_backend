const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true, unique: false },
  password: { type: String, required: true, unique: false },
  notifications: { type: Boolean, default: true },
  telegramChatId: {
    type: String,
    required: false,
    unique: false,
    default: null,
  },
  blockedSites: [{ type: String, required: true, unique: true }],
  isAdmin: {type: Boolean, default: false}
});

module.exports = mongoose.model("User", User);
