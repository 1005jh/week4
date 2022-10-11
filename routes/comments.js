const express = require("express");
const { Comments, Posts, Users } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const Joi = require("joi");
const router = express.Router();

// const commentSchema = Joi.object({
//   comment: Joi.string().required(),
// });

//*댓글 작성
router.post("/comments/:postId", authMiddleware, async (req, res) => {
  try {
    const { authorization } = req.headers;
    const [authType, authToken] = (authorization || "").split(" ");

    if (!authToken || authType !== "Bearer") {
      res.status(401).send({
        errorMessage: "로그인 후 이용 가능한 기능입니다.",
      });
      return;
    }

    const { postId } = req.params;
    const { nickname, userId } = res.locals.user;
    const { comment } = req.body;
    if (comment.length === 0) {
      res.send({ msg: "댓글을 입력해주세요" });
      return;
    }
    await Comments.create({ postId, userId, nickname, comment });

    res.status(201).send({ msg: "댓글을 작성했습니다!" });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error: error.message,
    });
  }
});

//*댓글 목록 조회
router.get("/comments/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comments.findAll({
      where: { postId },
      order: [["createdAt", "DESC"]],
    });
    console.log(comments);

    res.status(200).send({ data: comments });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      error: error.message,
    });
  }
});

//* 댓글 수정
router.put("/comments/:commentId", authMiddleware, async (req, res) => {
  try {
    const { authorization } = req.headers;
    const [authType, authToken] = (authorization || "").split(" ");

    if (!authToken || authType !== "Bearer") {
      res.status(401).send({
        errorMessage: "로그인 후 이용 가능한 기능입니다.",
      });
      return;
    }

    const { commentId } = req.params;
    const { userId } = res.locals.user;
    const { comment } = req.body;

    const existscomment = await Comments.findOne({
      where: { userId, commentId },
    });
    console.log(commentId);
    if (!existscomment) {
      res.status(404).send({ msg: "경로가 잘못되었습니다.." });
      return;
    }
    console.log("2");
    await Comments.update({ comment }, { where: { commentId } });
    res.status(200).send({ msg: "댓글을 수정했습니다." });
  } catch (error) {
    res.status(400).send({
      success: false,
      error: error.message,
    });
  }
});

//* 댓글 삭제
router.delete("/comments/:commentId", authMiddleware, async (req, res) => {
  try {
    const { authorization } = req.headers;
    const [authType, authToken] = (authorization || "").split(" ");

    if (!authToken || authType !== "Bearer") {
      res.status(401).send({
        errorMessage: "로그인 후 이용 가능한 기능입니다.",
      });
      return;
    }
    const { userId } = res.locals.user;

    const { commentId } = req.params;
    const isExist = await Comments.findOne({
      where: { userId, commentId },
    });

    if (!isExist || !commentId) {
      res.status(400).send({ msg: "댓글 조회에 실패했습니다." });
      return;
    }

    await Comments.destroy({ where: { commentId, userId } });
    res.status(200).send({ msg: "댓글을 삭제했습니다." });
  } catch (error) {
    res.status(400).send({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
