const express = require("express");
const { Posts, Likes, Users, sequelize } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();
const Joi = require("joi");
const { boolean } = require("joi");
const Sq = require("sequelize");
const Sequelize = Sq.Sequelize;

//*좋아요 기능(토탈포함)
router.put("/posts/:postId/like", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = res.locals.user;
    const like = await Likes.findOne({
      where: { userId, postId },
    });
    if (!like) {
      const like = new Likes({ postId, userId });
      await like.save();
      await Posts.increment("totalLike", { by: 1, where: { postId } });

      res.status(201).send({ msg: "좋아요를 등록했습니다." });
    } else if (like) {
      //userId로 like에 데이터가 있으면 지우고 없으면 새로 만들고.
      await Likes.destroy({ where: { postId, userId } });
      await Posts.increment({ totalLike: -1 }, { where: { postId } });
      res.status(200).send({ msg: "좋아요를 취소했습니다." });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      error: error.message,
    });
  }
});

//*좋아요 게시글 조회
router.get("/posts/like", authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;
    // const like_post = (await Likes.findByPk(userId)).map((item) => item.postId); //오리지날 배열이 필요한 경우가 필요하므로 변수이름 중요. / 오리지날 배열이 필요 없는 경우는 괜찮다.(재할당 생각해보기)
    // const posts = (await Posts.findAll()).filter((item) =>
    //   like_post.includes(item.postId)
    // );
    // const result = posts.sort((a, b) => b.totalLike - a.totalLike);
    const like = await Likes.findOne({
      where: { userId },
      attributes: [
        "userId",
        "postId",
        [Sequelize.col("User.nickname"), "nickname"],
        [Sequelize.col("Post.title"), "title"],
        [Sequelize.col("Post.createdAt"), "createdAt"],
        [Sequelize.col("Post.updatedAt"), "updatedAt"],
        [Sequelize.col("Post.totalLike"), "totalLike"],
      ],
      include: [
        {
          model: Posts,
          attributes: [],
        },
        {
          model: Users,
          attributes: [],
        },
      ],
      order: [[{ model: Posts }, "totalLike", "DESC"]],
    });

    console.log(like);
    res.status(200).send({ data: like });
  } catch (error) {
    res.status(400).send({
      success: false,
      error: error.message,
    });
  }
});

module.exports = router;

//  const like = await Likes.findAll({
//    where: { userId },
//    attributes: [],
//    include: [
//      {
//        model: Posts,
//        attributes: [
//          "userId",
//          "postId",
//          "title",
//          "createdAt",
//          "updatedAt",
//          "totalLike",
//        ],
//      },
//      {
//        model: Users,
//        attributes: ["nickname"],
//      },
//    ],
//    order: [[{ model: Posts }, "totalLike", "DESC"]],
//  });
