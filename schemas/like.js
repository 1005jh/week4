const { boolean } = require("joi");
const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema({
  postId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    require: true,
  },
});
LikeSchema.virtual("LikeId").get(function () {
  return this._id.toHexString();
});
LikeSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Like", LikeSchema);
