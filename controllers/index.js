const { getAllTopics } = require('./topics.controller');
const endPoints = require("./endPoints.controller");

exports.getAllTopics = getAllTopics;
exports.endPoints = endPoints;