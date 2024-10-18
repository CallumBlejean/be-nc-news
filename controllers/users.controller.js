const { fetchAllUsers, fetchUser } = require("../models/users.model");

exports.getAllUsers = (request, response, next) => {
  fetchAllUsers()
    .then((users) => {
      response.status(200).send(users);
    })
    .catch(next);
};

exports.getUser = (request, response, next) => {
  const { username } = request.params;
  fetchUser(username)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch(next);
};
