const { fetchArticle, fetchAllArticles, fetchArticleComments } = require("../models/articles.model")


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


exports.getAllArticles = (request, response, next) => {
    fetchAllArticles()
    .then((articles) => {
        response.status(200).send({ articles })
    })
    .catch((error) => {
        next(error);
      });
}

exports.getArticleComments = (request, response, next) => {
    const { article_id } = request.params
    fetchArticleComments(article_id)
    .then((article) => {
        response.status(200).send({ article })
    })
    .catch((error) => {
        next(error);
      });
}