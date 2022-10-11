const express = require("express");
const { Op } = require("sequelize");
const { Users } = require("../models");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();

const postUsersSchema = Joi.object({
  nickname: Joi.string().required(),
  password: Joi.string().required(),
  confirmPassword: Joi.string().required(),
});

//*회원가입 API
router.post("/signup", async (req, res) => {
  try {
    const { nickname, password, confirmPassword } =
      await postUsersSchema.validateAsync(req.body);
    if (password !== confirmPassword) {
      res.status(400).send({
        errorMessage: "패스워드가 패스워드 확인란과 다릅니다.",
      });
      return;
    }

    const existsUsers = await Users.findAll({
      where: {
        nickname,
      },
    });
    console.log(existsUsers);
    if (existsUsers.length) {
      res.status(400).send({
        errorMessage: "닉네임이 이미 사용중입니다.",
      });
      return;
    }

    await Users.create({ nickname, password });

    res.status(201).send({ msg: "회원가입에 성공하였습니다." });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
});

const postLoginSchema = Joi.object({
  nickname: Joi.string().required(),
  password: Joi.string().required(),
});

//*로그인 API
router.post("/login", async (req, res) => {
  try {
    const { authorization } = req.headers;

    if (authorization) {
      res.status(401).send({
        errorMessage: "이미 로그인이 되어있습니다.",
      });
      return;
    }
    const { nickname, password } = await postLoginSchema.validateAsync(
      req.body
    );
    const user = await Users.findOne({
      where: {
        nickname,
      },
    });

    if (!user) {
      res.status(401).send({
        errorMessage: "닉네임 또는 패스워드가 잘못됐습니다.",
      });
      return;
    }

    const token = jwt.sign({ userId: user.userId }, "my-secret-key");
    res.send({
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(400).send({
      errorMessage: "요청한 형식이 올바르지 않습니다.",
    });
  }
});

//*토큰인증
router.get("/users/me", authMiddleware, async (req, res) => {
  const { user } = res.locals;
  res.send({
    user: {
      nickname: user.nickname,
    },
  });
});

module.exports = router;
