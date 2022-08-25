const user = require('../models/user');

const createUser = (req, res) => user.create(req.body)
  .then((data) => res.status(201).send(data))
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: `error validation user ${err}` });
    }
    else {
      res.status(500).send({ message: `internal server error ${err}` });
    }
  });

const getUser = (req, res) => user.findById(req.params._id)
  .then((data) => res.status(201).send(data))
  .catch((err) => res.status(500).send({ message: `internal server error ${err}` }));

const getUsers = (req, res) => {

};

module.exports = { createUser, getUser, getUsers };
