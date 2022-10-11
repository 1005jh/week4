// const jwt = require("jsonwebtoken");
// const { Users } = require("../models");

// module.exports = (req, res, next) => {
//   const { authorization } = req.headers;
//   const [tokenType, tokenValue] = authorization.split(" ");
//   console.log(authorization);
//   if (tokenType !== "Bearer") {
//     res.status(401).send({
//       errorMessage: "로그인 후 사용하세요",
//     });
//     return;
//   }

//   try {
//     const { userId } = jwt.verify(tokenValue, "my-secret-key");
//     Users.findByPk(userId)
//       .exec()
//       .then((user) => {
//         res.locals.user = user;
//         next();
//       });
//   } catch (error) {
//     res.status(401).send({
//       errorMessage: "로그인 후 사용하세요11",
//     });
//     return;
//   }
// };
const jwt = require("jsonwebtoken");
const { Users } = require("../models");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  const [authType, authToken] = (authorization || "").split(" ");

  if (!authToken || authType !== "Bearer") {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
    return;
  }

  try {
    const { userId } = jwt.verify(authToken, "my-secret-key");
    Users.findByPk(userId).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (err) {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
  }
};
