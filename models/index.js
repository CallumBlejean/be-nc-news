const { fetchAllTopics } = require('./topics.model');
const endPointsModel = require('./endPoints.model');

exports.fetchAllTopics = fetchAllTopics;
exports.endPoints = endPointsModel;
