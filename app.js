const express = require("express");
const app = express();
const { getAllTopics } = require("./controllers/index");


app.get("/api/topics", getAllTopics);



app.all('/api/*', (request, response) => {
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

