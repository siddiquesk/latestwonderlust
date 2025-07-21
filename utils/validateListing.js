const { listingSchema } = require("../utils/joiValidation.js");
const ExpressError = require("../utils/ExpressError.js");
const validateListing = (req, res, next) => {
  let result = listingSchema.validate(req.body);
  if (result.error) {
    throw new ExpressError(400, result.error.details[0].message);
  }
  next();
};
module.exports = validateListing;
