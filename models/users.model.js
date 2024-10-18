const db = require("../db/connection")

exports.fetchAllUsers = () => {
    return db.query(`
        SELECT * FROM users
        `)
        .then((result) => {
            return result.rows
        })
};

exports.fetchUser = (userName) => {
    return db.query(`
        SELECT * FROM users
        WHERE username = $1
        `, [userName])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: "404: User not found" });
              }
            return result.rows[0]
        })
}