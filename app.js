const express = require("express");
const routes = require("./routes");
const app = express();
const port = 4000;

const connect = require("./schemas");
connect();

app.use(express.json());

app.use("/", express.urlencoded({ extended: false }), routes);

app.listen(port, () => {
  console.log(port, "포트로 서버가 열렸어요!");
});
