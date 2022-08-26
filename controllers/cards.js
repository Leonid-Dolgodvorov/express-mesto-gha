const Card = require('../models/card');
const { NotFoundError } = require('../errors/NotFoundError');

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Ошибка создания карточки: переданы некорректные данные' });
      } else {
        res.status(500).send({ message: `internal server error ${err}` });
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
    .then(() => res.status(201).send({ message: `Карточка с cardId ${cardId} удалена` }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Ошибка создания карточки: переданы некорректные данные' });
      } else if (err.name === 'NotFoundError') {
        res.status(404).send({ message: 'Ошибка: карточка не найдена' });
      } else {
        res.status(500).send({ message: `internal server error ${err}` });
      }
    });
};

const getCards = (req, res) => Card.find({})
  .then((cards) => res.status(201).send({ data: cards }))
  .catch((err) => {
    res.status(500).send({ message: `internal server error ${err}` });
  });

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
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
        res.status(400).send({ message: 'Ошибка лайка: переданы некорректные данные' });
      } else if (err.name === 'NotFoundError') {
        res.status(404).send({ message: 'Ошибка: карточка не найдена' });
      } else {
        res.status(500).send({ message: `internal server error ${err}` });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
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
        res.status(400).send({ message: 'Ошибка лайка: переданы некорректные данные' });
      } else if (err.name === 'NotFoundError') {
        res.status(404).send({ message: 'Ошибка: карточка не найдена' });
      } else {
        res.status(500).send({ message: `internal server error ${err}` });
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
