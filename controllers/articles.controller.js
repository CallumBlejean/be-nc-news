const { fetchArticle, fetchAllArticles, fetchArticleComments, insertComment } = require("../models/articles.model")


exports.postArticleComment = (request, response, next) => {
    const { article_id } = request.params;
    const { username, body } = request.body;
  
    insertComment(article_id, username, body)
      .then((comment) => {
        response.status(201).send({ comment });
      })
      .catch(next);
    }



exports.getArticle = (request, response, next) => {
    const { article_id } = request.params
    fetchArticle(article_id)
    .then((article) => {
        response.status(200).send({ article })
    })
    .catch(next)
}


exports.getAllArticles = (request, response, next) => {
    fetchAllArticles()
    .then((articles) => {
        response.status(200).send({ articles })
    })
    .catch(next)
}

exports.getArticleComments = (request, response, next) => {
    const { article_id } = request.params
    fetchArticleComments(article_id)
    .then((comments) => {
        response.status(200).send({ comments })
    })
    .catch(next)
}