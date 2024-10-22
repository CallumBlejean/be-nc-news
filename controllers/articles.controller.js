const {
  fetchArticle,
  fetchAllArticles,
  fetchArticleComments,
  insertComment,
  updateArticleVotes,
  insertArticle,
} = require("../models/articles.model");

exports.postArticle = (request, response, next) => {
  const { author, title, body, topic, article_img_url } = request.body;

  insertArticle(author, title, body, topic, article_img_url)
    .then((newArticle) => {
      response.status(201).send({ newArticle });
    })
    .catch(next);
};




exports.patchArticleVotes = (request, response, next) => {
  const { article_id } = request.params;
  const { inc_votes } = request.body;

  updateArticleVotes(article_id, inc_votes)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next)
    }



exports.postArticleComment = (request, response, next) => {
  const { article_id } = request.params;
  const { username, body } = request.body;

  insertComment(article_id, username, body)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch(next);
};

exports.getArticle = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticle(article_id)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (request, response, next) => {
  const { sort_by, order, topic } = request.query
  fetchAllArticles(sort_by, order, topic)
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch(next);
};

exports.getArticleComments = (request, response, next) => {
  const { article_id } = request.params;
  fetchArticleComments(article_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch(next);
};
