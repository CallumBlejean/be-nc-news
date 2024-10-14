const { getAllTopics } = require('./topics.controller');
const { getEndPoints } = require("./endPoints.controller");

exports.getAllTopics = getAllTopics;
exports.getEndPoints = getEndPoints;