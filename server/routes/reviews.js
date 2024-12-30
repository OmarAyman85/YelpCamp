const express = require("express");
const catchAsync = require("../utils/catchAsync");
const reviewsC = require("../controllers/reviews");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");
//-----------------------------------------------------------------------------
const router = express.Router({ mergeParams: true });
//-----------------------------------------------------------------------------
// Creating new review after submitting the form
router.post("/", isLoggedIn, validateReview, catchAsync(reviewsC.createReview));
//-----------------------------------------------------------------------------
// Deleting a review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviewsC.deleteReview)
);
//-----------------------------------------------------------------------------
module.exports = router;
