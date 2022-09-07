class NotValidDataError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NotValidDataError';
    this.statusCode = 400;
  }
}

module.exports = { NotValidDataError };
