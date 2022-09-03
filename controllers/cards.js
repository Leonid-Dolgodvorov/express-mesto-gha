const Card = require('../models/card');
const { NotFoundError } = require('../errors/NotFoundError');
const { NOT_VALID_DATA_ERROR, NOT_FOUND_ERROR, SERVER_ERROR } = require('../utils/constants');

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(NOT_VALID_DATA_ERROR).send({ message: 'Ошибка создания карточки: переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail(() => {
      const notFoundError = new NotFoundError('Ошибка: карточка не найдена');
      throw notFoundError;
    })
    .then(() => res.status(200).send({ message: `Карточка с cardId ${cardId} удалена` }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_VALID_DATA_ERROR).send({ message: 'Ошибка создания карточки: переданы некорректные данные' });
      } else if (err.name === 'NotFoundError') {
        res.status(NOT_FOUND_ERROR).send({ message: 'Ошибка: карточка не найдена' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(200).send({ data: cards }))
  .catch(() => {
    res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
  });

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      const notFoundError = new NotFoundError('Ошибка: карточка не найдена');
      throw notFoundError;
    })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_VALID_DATA_ERROR).send({ message: 'Ошибка лайка: переданы некорректные данные' });
      } else if (err.name === 'NotFoundError') {
        res.status(NOT_FOUND_ERROR).send({ message: 'Ошибка: карточка не найдена' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      const notFoundError = new NotFoundError('Ошибка: карточка не найдена');
      throw notFoundError;
    })
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(NOT_VALID_DATA_ERROR).send({ message: 'Ошибка лайка: переданы некорректные данные' });
      } else if (err.name === 'NotFoundError') {
        res.status(NOT_FOUND_ERROR).send({ message: 'Ошибка: карточка не найдена' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Внутренняя ошибка сервера' });
      }
    });
};

module.exports = {
  createCard,
  deleteCard,
  getCards,
  likeCard,
  dislikeCard,
};
