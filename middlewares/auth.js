const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  let payload;
  if (!req.cookies.jwt) {
    next(new UnauthorizedError('Ошибка авторизации'));
  } else {
    const token = req.cookies.jwt;
    try {
      payload = jwt.verify(token, 'over-secret-key');
      req.user = payload;
    } catch (err) {
      next(new UnauthorizedError('Ошибка авторизации'));
    }
  }
  next();
};

module.exports = auth;
