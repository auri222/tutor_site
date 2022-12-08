const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  content: {
    type: String,
    require: true
  },
  sender: {
    type: String, 
    require: true
  },
  isCheck: {
    type: Boolean
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: Date.now,
  }
});

module.exports = mongoose.model("contacts", ContactSchema);
