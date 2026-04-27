const { validationResult } = require('express-validator');

/** Runs after express-validator checks; returns 422 if any errors found */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  next();
};

module.exports = validateRequest;
