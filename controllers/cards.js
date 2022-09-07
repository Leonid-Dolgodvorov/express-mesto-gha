const Card = require('../models/card');
const { NotFoundError } = require('../errors/NotFoundError');
const { NotValidDataError } = require('../errors/NotValidDataError');
const { ForbiddenError } = require('../errors/ForbiddenError');

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotValidDataError('Ошибка создания карточки: переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById(cardId)
    .orFail(() => new NotFoundError('Ошибка: карточка не найдена'))
    .then((card) => {
      if (req.user._id !== card.owner._id.toString()) {
        next(new ForbiddenError('Ошибка: невозможно удалить чужую карточку'));
      } else {
        Card.findByIdAndRemove(cardId)
          .then(() => {
            res.send({ message: 'Карточка удалена' });
          })
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotValidDataError('Ошибка удаления карточки: переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const getCards = (req, res, next) => Card.find({})
  .then((cards) => res.status(200).send({ data: cards }))
  .catch((err) => {
    next(err);
  });

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError('Ошибка: карточка не найдена'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotValidDataError('Ошибка лайка: переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => new NotFoundError('Ошибка: карточка не найдена'))
    .then((card) => {
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotValidDataError('Ошибка лайка: переданы некорректные данные'));
      } else {
        next(err);
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
