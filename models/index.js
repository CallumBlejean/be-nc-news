const { fetchAllTopics } = require('./topics.model');
const { fetchEndPoints } = require('./endPoints.model');
const { fetchArticle } = require("./articles.model")

module.exports = { 
    fetchArticle,
    fetchAllTopics,
    fetchEndPoints
}
