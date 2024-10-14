const { fetchEndPoints } = require('../models/index');

exports.getEndPoints = (request, response, next) => {
    fetchEndPoints()
    .then(endpoint => {
    response.status(200).send(endpoint);
    })
    .catch((error) => {
        next(error);
      });
}
