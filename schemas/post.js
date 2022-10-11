const mongoose = require("mongoose");
const { Schema } = mongoose;
const PostSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    nickname: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    totalLike: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
PostSchema.virtual("postId").get(function () {
  return this._id.toHexString();
});
PostSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model(`Post`, PostSchema);
