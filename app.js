const express = require("express");
const app = express();
const { getAllTopics } = require("./controllers/topics.controller");
const { getEndPoints } = require("./controllers/endPoints.controller")
const { getArticle, getAllArticles, getArticleComments } = require("./controllers/articles.controller")



app.get("/api", getEndPoints);
app.get("/api/topics", getAllTopics);
app.get("/api/articles", getAllArticles);
app.get("/api/articles/:article_id", getArticle);

app.all("*", (request, response) => {
  response.status(404).send({ msg: "404: Not Found" });
});

app.use((error, request, response, next) => {
  if (error.status) {
    response.status(error.status).send({ msg: error.msg });
  } else if (error.code === "22P02") {
    response.status(400).send({ msg: "400: Bad Request" });
  } else {
    response.status(500).send({ msg: "Internal Server Error" });
  }
});

module.exports = app;
