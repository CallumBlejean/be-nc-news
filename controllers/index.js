const { getAllTopics } = require('./topics.controller');
const { getEndPoints } = require('./endPoints.controller');
const { getArticle } = require('./articles.controller');

module.exports = { 
    getAllTopics, 
    getEndPoints, 
    getArticle };