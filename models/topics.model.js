const db = require("../db/connection");

exports.fetchAllTopics = () => {
  return db
    .query(`SELECT * FROM topics;`)
    .then(({ rows }) => rows)
    .catch((error) => {
      throw error;
    });
};

//edit for jay