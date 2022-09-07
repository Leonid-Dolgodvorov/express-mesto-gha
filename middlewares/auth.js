const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  if (!req.cookies.jwt) {
    throw new Error('Ошибка авторизации');
  }

  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, 'over-secret-key');
  } catch (err) {
    next(new Error('Ошибка авторизации'));
  }

  req.user = payload;

  next();
};

module.exports = auth;
