const mongoose = require("mongoose");
const { Schema } = mongoose;

const Comment = new Schema({
  from: {type: String, required: true},
  text: {type: String, required: true},
  websiteId: {type: String, required: true},
  verified: {type: Boolean, default: false}
})

module.exports = mongoose.model("Comment", Comment);
