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
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const getUser = (req, res) => User.findById(req.params.id)
  .orFail(() => {
    throw new NotFoundError('Ошибка: пользователь не найден');
  })
  .then((user) => res.send(user))
  .catch((err) => {
    if (err.name === 'CastError') {
      res.status(NOT_VALID_DATA_ERROR).send({ message: 'Ошибка поиска пользователя: переданы некорректные данные' });
    } else if (err.name === 'NotFoundError') {
      res.status(NOT_FOUND_ERROR).send({ message: 'Ошибка: пользователь с данным id не найден' });
    } else {
      res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
    }
  });

const getUsers = (req, res) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(() => res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' }));

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
      } else if (err.name === 'NotFoundError') {
        res.status(NOT_FOUND_ERROR).send({ message: 'Ошибка: пользователь не найден' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
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
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
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
