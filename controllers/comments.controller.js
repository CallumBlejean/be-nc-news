const { deleteCommentById } = require("../models/comments.model")

exports.deleteComment = (request, response, next) => {
    const { comment_id } = request.params

    deleteCommentById(comment_id)
    .then(() => {
        response.status(204).send()
    })
    .catch(next)
}