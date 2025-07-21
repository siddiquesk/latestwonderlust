const Listing = require("../model/listings.js");
const Review = require("../model/review.js");

module.exports.isLoggedIn = async (req, res, next) => {
  try {
    if (!req.isAuthenticated()) {
      req.session.redirectUrl = req.originalUrl;
      req.flash("error", "You must be Logged In!");
      return res.redirect("/login");
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUserUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing.owner.equals(req.user._id)) {
      req.flash(
        "error",
        "You don't have permission to edit and delete this listing."
      );
      return res.redirect(`/listings/${id}`);
    }
    next();
  } catch (err) {
    next(err);
  }
};

module.exports.isAuthor = async (req, res, next) => {
  try {
    const { reviewId, id } = req.params;
    const reviews = await Review.findById(reviewId);
    if (!reviews.author.equals(req.user._id)) {
      req.flash("error", "You don't have permission to delete this Review.");
      return res.redirect(`/listings/${id}`);
    }
    next();
  } catch (err) {
    next(err);
  }
};
