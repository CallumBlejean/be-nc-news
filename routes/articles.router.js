const express = require("express");
const {
  getArticle,
  getAllArticles,
  getArticleComments,
  postArticleComment,
  patchArticleVotes,
  postArticle,
} = require("../controllers/articles.controller");

const articlesRouter = express.Router();

articlesRouter.get("/", getAllArticles);
articlesRouter.get("/:article_id", getArticle);
articlesRouter.get("/:article_id/comments", getArticleComments);
articlesRouter.post("/:article_id/comments", postArticleComment);
articlesRouter.patch("/:article_id", patchArticleVotes);
articlesRouter.post("/", postArticle)

module.exports = articlesRouter;

