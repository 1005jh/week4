const express = require("express");
const Posts = require("./posts");
const Likes = require("./likes");
const Users = require("./users");
const Comments = require("./comments");
const router = express.Router();

router.use("/", Users);
router.use("/", Likes); //위치
router.use("/", Posts);
router.use("/", Comments);

module.exports = router;
