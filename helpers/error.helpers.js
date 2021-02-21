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

class JoiValidationError extends Error {
  constructor(message) {
    super(message);
    this.status = 400;
  }
}

module.exports = {
  ConflictError,
  UnauthorizedError,
  JoiValidationError,
};
