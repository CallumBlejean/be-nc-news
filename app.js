const cors = require('cors');
const express = require("express");
const app = express();
const articlesRouter = require("./routes/articles.router");
const topicsRouter = require("./routes/topics.router");
const commentsRouter = require("./routes/comments.router");
const usersRouter = require("./routes/users.router");
const { getEndPoints } = require("./controllers/endPoints.controller");

app.use(cors());
app.use(express.json());

app.get("/api", getEndPoints);
app.use("/api/topics", topicsRouter);
app.use("/api/articles", articlesRouter);
app.use("/api/comments", commentsRouter);
app.use("/api/users", usersRouter);

app.all("*", (request, response) => {
  response.status(404).send({ msg: "404: Not Found" });
});

app.use((error, request, response, next) => {
  if (error.status) {
    response.status(error.status).send({ msg: error.msg });
  } else if (error.code === "22P02" || error.code === "23502") {
    response.status(400).send({ msg: "400: Bad Request" });
  } else if (error.code === "23503") {
    response.status(404).send({ msg: "404: Article or User Not Found" });
  } else {
    console.log(error, "<<500 error")
    response.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
