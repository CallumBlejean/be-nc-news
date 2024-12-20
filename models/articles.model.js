const db = require("../db/connection");

exports.insertArticle = (
  author,
  title,
  body,
  topic,
  article_img_url = "http://website.com/image.jpg"
) => {
  if (!author || !title || !body || !topic) {
    return Promise.reject({
      status: 400,
      msg: "400: Bad Request - Missing required fields",
    });
  }

  return db
    .query(
      `INSERT INTO articles (author, title, body, topic, article_img_url, votes, created_at)
       VALUES ($1, $2, $3, $4, $5, 0, NOW())
       RETURNING *;`,
      [author, title, body, topic, article_img_url]
    )
    .then((result) => {
      const article = result.rows[0];
      return db
        .query(
          `SELECT * 
           FROM comments 
           WHERE article_id = $1
           `,
          [article.article_id]
        )
        .then(({ rows }) => {
          article.comment_count = rows.length;
          return article;
        });
    });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  return db
    .query(
      `
      UPDATE articles
      SET votes = votes + $1
      WHERE article_id = $2
      RETURNING *;
      `,
      [inc_votes, article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404: Article Not Found" });
      }
      return result.rows[0];
    });
};

exports.insertComment = (article_id, username, body) => {
  return db
    .query(
      `
    INSERT INTO comments (article_id, author, body, votes, created_at)
    VALUES ($1, $2, $3, 0, NOW())
    RETURNING *;
    `,
      [article_id, username, body]
    )
    .then((result) => result.rows[0]);
};

exports.fetchAllArticles = (sort_by = "created_at", order = "desc", topic) => {
  const validSortBys = [
    "title",
    "topic",
    "topic",
    "author",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrder = ["asc", "desc"];
  const queryTopic = [];

  if (!validSortBys.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "400: Invalid sort_by Query" });
  }
  if (!validOrder.includes(order)) {
    return Promise.reject({ status: 400, msg: "400: Invalid order Query" });
  }
  let queryStr = `
        SELECT 
          articles.author,
          articles.title,
          articles.article_id,
          articles.topic,
          articles.created_at,
          articles.votes,
          articles.article_img_url,
          COUNT(comments.comment_id)::INT AS comment_count
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        
      `;

  if (topic) {
    queryStr += `WHERE articles.topic = $1`;
    queryTopic.push(topic);
  }
  queryStr += `
        GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order};
  `;
  return db.query(queryStr, queryTopic).then((result) => {
    if (result.rows.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "404: No Articles Found for Specified Topic",
      });
    }
    return result.rows;
  });
};

exports.fetchArticle = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count
       FROM articles
       LEFT JOIN comments ON comments.article_id = articles.article_id
       WHERE articles.article_id = $1
       GROUP BY articles.article_id`,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404: Article Not Found" });
      }
      return result.rows[0];
    });
};

exports.fetchArticleComments = (article_id) => {
  return db
    .query(
      `
    SELECT * FROM comments
    WHERE article_id = $1
    ORDER BY created_at ASC
    `,
      [article_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404: Article Not Found" });
      }
      return result.rows;
    });
};
