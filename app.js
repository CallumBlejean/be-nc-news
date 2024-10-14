const express = require("express");
const app = express();
const { getAllTopics, getEndPoints, getArticle } = require("./controllers/index");


app.get("/api/topics", getAllTopics);
app.get("/api", getEndPoints)

app.get("/api/articles/:article_id", getArticle)


app.all('*', (request, response) => {
  response.status(404).send({ msg: "404: Not Found" });
});

app.use((error, request, response, next) => {
  if (error.status) {
    response.status(error.status).send({ msg: error.msg});
  } else {
    response.status(500).send({ msg: "Internal Server Error" });
  }
});



module.exports = app;

