const express = require("express");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { reviewSchema } = require("../schemas");
//-----------------------------------------------------------------------------
const router = express.Router({ mergeParams: true });
//-----------------------------------------------------------------------------
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body, { abortEarly: false }); // abortEarly: false ensures all errors are returned
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
//-----------------------------------------------------------------------------
// Creating new review after submitting the form
router.post(
  "/",
  validateReview,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
//-----------------------------------------------------------------------------
// Deleting a review
router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
  })
);
//-----------------------------------------------------------------------------
module.exports = router;