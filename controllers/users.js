const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const NotValidDataError = require('../errors/NotValidDataError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    })
      .then((user) => res.status(201).send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          next(new NotValidDataError('Ошибка создания пользователя: переданы некорректные данные'));
        } else if (err.code === 11000) {
          next(new ConflictError('Ошибка создания пользователя: пользователь с таким email уже существует'));
        } else {
          next(err);
        }
      }));
};

const getUser = (req, res, next) => User.findById(req.params.id)
  .orFail(() => new NotFoundError('Ошибка: пользователь не найден'))
  .then((user) => res.send(user))
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new NotValidDataError('Ошибка поиска пользователя: переданы некорректные данные'));
    } else {
      next(err);
    }
  });

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => new NotFoundError('Пользователь с указанным id не найден'))
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotValidDataError('Переданы некорректные данные для получения пользователя'));
      } else {
        next(err);
      }
    });
};

const getUsers = (req, res, next) => User.find({})
  .then((users) => res.send({ data: users }))
  .catch(next);

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Ошибка: пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotValidDataError('Ошибка обновления данных пользователя: переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'over-secret-key', {
        expiresIn: '7d',
      });
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      });
      res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError('Ошибка авторизации'));
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => new NotFoundError('Ошибка: пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotValidDataError('Ошибка обновления аватара: переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  createUser,
  getUser,
  getCurrentUser,
  getUsers,
  updateProfile,
  updateAvatar,
  login,
};
