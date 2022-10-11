const express = require("express");
const { Posts, Users } = require("../models");

const Joi = require("joi");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

const postSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
});
//*게시글 작성
router.post("/posts", authMiddleware, async (req, res) => {
  try {
    const { authorization } = req.headers;
    const [authType, authToken] = (authorization || "").split(" ");

    if (!authToken || authType !== "Bearer") {
      res.status(401).send({
        errorMessage: "로그인 후 이용 가능한 기능입니다.",
      });
      return;
    }

    const { userId, nickname } = res.locals.user;
    const { title, content } = await postSchema.validateAsync(req.body);
    const post = new Posts({ title, content, userId, nickname });
    await post.save();

    res.status(201).send({ msg: "게시글 작성에 성공하였습니다." });
  } catch (error) {
    res.status(400).send({
      success: false,
      error: error.message,
    });
  }
});

//*게시글 목록 조회
router.get("/posts", async (req, res) => {
  try {
    const posts = await Posts.findAll();
    const resultList = [];

    for (const post of posts) {
      resultList.push({
        userId: post.userId,
        postId: post.postId,
        nickname: post.nickname,
        title: post.title,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      });
    }
    res.status(200).send({ data: resultList });
  } catch (error) {
    res.status(400).send({
      success: false,
      error: error.message,
    });
  }
});

//*게시글 상세조회
router.get("/posts/:postId", async (req, res) => {
  try {
    const { postId } = req.params;
    if (!postId) {
      res.status(400).send({ msg: "데이터 형식이 올바르지 않습니다." });
    }
    const post = await Posts.findByPk(postId);

    const result = {
      postId: post.postId,
      userId: post.userId,
      nickname: post.nickname,
      title: post.title,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
    res.status(200).send({ data: result });
  } catch (error) {
    res.status(400).send({
      success: false,
      error: error.message,
    });
  }
});

//*게시글 수정
router.put("/posts/:postId", authMiddleware, async (req, res) => {
  try {
    const { authorization } = req.headers;
    const [authType, authToken] = (authorization || "").split(" ");

    if (!authToken || authType !== "Bearer") {
      res.status(401).send({
        errorMessage: "로그인 후 이용 가능한 기능입니다.",
      });
      return;
    }
    console.log("3");
    const { userId } = res.locals.user;
    const { title, content } = req.body;
    const { postId } = req.params;
    console.log("4");
    const existspost = await Posts.findOne({
      where: { userId, postId },
    });
    console.log(existspost);
    if (!existspost) {
      res.status(404).send({ msg: "게시글 조회에 실패했습니다." });
      return;
    }
    await Posts.update({ title, content }, { where: { postId } });
    console.log("2");
    res.status(201).send({ msg: "게시글을 수정했습니다." });
  } catch (error) {
    res.status(400).send({
      success: false,
      error: error.message,
    });
  }
});

//*게시글 삭제
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
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
    const { userId } = res.locals.user;
    const isExist = await Posts.findOne({
      where: { userId, postId },
    });

    if (!isExist || !postId) {
      res.status(400).send({ msg: "게시글 조회에 실패했습니다.!" });
      return;
    }
    await Posts.destroy({ where: { userId, postId } });
    res.status(201).send({ msg: "게시글을 삭제했습니다.!" });
  } catch (error) {
    res.status(400).send({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;
