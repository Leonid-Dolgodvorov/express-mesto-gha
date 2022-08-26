const User = require('../models/user');
const { NotFoundError } = require('../errors/NotFoundError');
const { NOT_VALID_DATA_ERROR, NOT_FOUND_ERROR, SERVER_ERROR } = require('../utils/constants');

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(NOT_VALID_DATA_ERROR).send({ message: 'Ошибка создания пользователя: переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR).send({ message: `internal server error ${err}` });
      }
    });
};

const getUser = (req, res) => User.findById(req.params.id)
  .orFail(() => {
    const notFoundError = new NotFoundError('Ошибка: пользователь не найден');
    throw notFoundError;
  })
  .then((user) => res.status(200).send(user))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(NOT_VALID_DATA_ERROR).send({ message: 'Ошибка создания карточки: переданы некорректные данные' });
    } else if (err.name === 'notFoundError') {
      res.status(NOT_FOUND_ERROR).send({ message: 'Ошибка: пользователь не найден' });
    } else {
      res.status(SERVER_ERROR).send({ message: `internal server error ${err}` });
    }
  });

const getUsers = (req, res) => User.find({})
  .then((users) => res.status(200).send({ data: users }))
  .catch((err) => res.status(500).send({ message: `internal server error ${err}` }));

const updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      const notFoundError = new NotFoundError('Ошибка: пользователь не найден');
      throw notFoundError;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(NOT_VALID_DATA_ERROR).send({ message: 'Ошибка обновления данных пользователя: переданы некорректные данные' });
      } else if (err.name === 'notFoundError') {
        res.status(NOT_FOUND_ERROR).send({ message: 'Ошибка: пользователь не найден' });
      } else {
        res.status(SERVER_ERROR).send({ message: `internal server error ${err}` });
      }
    });
};

const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      const notFoundError = new NotFoundError('Ошибка: пользователь не найден');
      throw notFoundError;
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(NOT_VALID_DATA_ERROR).send({ message: 'Ошибка обновления аватара: переданы некорректные данные' });
      } else if (err.name === 'notFoundError') {
        res.status(NOT_FOUND_ERROR).send({ message: 'Ошибка: пользователь не найден' });
      } else {
        res.status(SERVER_ERROR).send({ message: `internal server error ${err}` });
      }
    });
};

module.exports = {
  createUser,
  getUser,
  getUsers,
  updateProfile,
  updateAvatar,
};
