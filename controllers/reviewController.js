const Review = require("../model/review.js");
const Listing = require("../model/listings.js");

// Create a new review and associate it with a listing
const createReview = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    const newReview = new Review(req.body.reviews);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "Your review has been added successfully.");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    next(err);
  }
};

// Delete a review and remove its reference from the listing
const destroyReview = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });

    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "The review has been deleted.");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReview,
  destroyReview,
};
