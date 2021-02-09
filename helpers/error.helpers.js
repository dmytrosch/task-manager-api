class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.status = 409;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.status = 401;
  }
}

module.exports = {
  ConflictError,
  UnauthorizedError,
};
