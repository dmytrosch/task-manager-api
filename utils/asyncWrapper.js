const asyncWrapper = (controller) => (req, res, next) =>
    controller(req, res, next).catch(next);

module.exports = asyncWrapper;