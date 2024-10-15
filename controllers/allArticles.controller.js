const { fetchAllArticles } = require("../models/allArticles.model")

exports.getAllArticles = (request, response, next) => {
    fetchAllArticles()
    .then((articles) => {
        response.status(200).send({ articles })
    })
    .catch((error) => {
        next(error);
      });
}