const { fetchArticle } = require("../models/articleById.model")

exports.getArticle = (request, response, next) => {
    const { article_id } = request.params
    fetchArticle(article_id)
    .then((article) => {
        response.status(200).send({ article })
    })
    .catch((error) => {
        next(error);
      });
}