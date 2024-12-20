const db = require("../db/connection");

exports.deleteCommentById = (comment_id) => {
  return db
    .query(
      `
        DELETE FROM comments
        WHERE comment_id = $1
        RETURNING *;
        `,
      [comment_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404: Comment Not Found" });
      }
      return result.rows[0];
    });
};
exports.updateCommentVotes = (comment_id, inc_votes) => {
  return db
    .query(
      `
        UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING *;
        `,
      [inc_votes, comment_id]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404: Comment Not Found" });
      }
      return result.rows[0]
    });
};
