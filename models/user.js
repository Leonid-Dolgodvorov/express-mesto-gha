const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ошибка: добавьте корректное имя пользователя'],
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: [true, 'Ошибка: добавьте корректное описание пользователя'],
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
