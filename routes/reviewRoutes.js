const express = require("express");
const router = express.Router();
const { isLoggedIn, isAuthor } = require("../middleware/middleware.js");
const {
  createReview,
  destroyReview,
} = require("../controllers/reviewController.js");
router.route("/listings/:id/reviews").post(isLoggedIn, createReview);
router
  .route("/listings/:id/reviews/:reviewId")
  .delete(isLoggedIn, isAuthor, destroyReview);
module.exports = router;
