const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  content: {
    type: String,
    require: true
  },
  reviewer: {
    type: String,
    require: true
  },
  tutor: {
    type: Schema.Types.ObjectId,
    require: true
  },
  parentID: {
    type: Schema.Types.ObjectId
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: Date.now,
  }
});

module.exports = mongoose.model("comments", CommentSchema);
