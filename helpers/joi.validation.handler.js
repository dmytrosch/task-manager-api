const { JoiValidationError } = require("./error.helpers");

module.exports = (schema, reqPart = "body") => {
  return (req, res, next) => {
    const validationResult = schema.validate(req[reqPart]);
    if (validationResult.error) {
      throw new JoiValidationError(validationResult.error.message);
    }
    next();
  };
};
