const { fetchArticle } = require("../models/index")

exports.getArticle = (request, response, next) => {
    const { article_id } = request.params
    if (isNaN(article_id)){
        return response.status(400).send({ msg: `400: Bad Request`})
    }
    fetchArticle(article_id)
    .then((article) => {
        if(!article){
            return response.status(404).send({ msg: `404: Article Not Found`})
        }

        response.status(200).send({ article })
    })
    .catch((error) => {
        next(error);
      });
}