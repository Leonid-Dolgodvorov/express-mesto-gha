const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/UnauthorizedError');
require('dotenv').config();

const { JWT_SECRET } = process.env;

const auth = (req, res, next) => {
  let payload;
  if (!req.cookies.jwt) {
    next(new UnauthorizedError('Ошибка авторизации'));
  } else {
    const token = req.cookies.jwt;
    try {
      payload = jwt.verify(token, JWT_SECRET);
      req.user = payload;
    } catch (err) {
      next(new UnauthorizedError('Ошибка авторизации'));
    }
  }
  next();
};

module.exports = auth;
