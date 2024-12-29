const express = require("express");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundsSchema } = require("../schemas");
const { isLoggedIn } = require("../middleware");
//-----------------------------------------------------------------------------
const router = express.Router();
//-----------------------------------------------------------------------------
const validateCampground = (req, res, next) => {
  const { error } = campgroundsSchema.validate(req.body, { abortEarly: false }); // abortEarly: false ensures all errors are returned
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
//-----------------------------------------------------------------------------
// Getting all the campgrounds
router.get(
  "/",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);
//-----------------------------------------------------------------------------
// Request for creating a new campground
// Reordered here before the getting by the ID because /new will be treated as an id not a route
router.get("/new", isLoggedIn, async (req, res) => {
  res.render("campgrounds/new");
});
// Creating new campground after submitting the form
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campgrounds);
    await campground.save();
    req.flash("success", "A new campground is successfully made");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
//-----------------------------------------------------------------------------
// Getting details of specific campground
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    if (!campground) {
      req.flash("error", "campground is not found !!!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/show", { campground });
  })
);
//-----------------------------------------------------------------------------
// Request for updating a campground
router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "campground is not found !!!");
      return res.redirect("/campgrounds");
    }
    res.render("campgrounds/edit", { campground });
  })
);
// Updating an existing campground
router.put(
  "/:id",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {
      ...req.body.campgrounds,
    });
    req.flash("success", "The campground is successfully updated");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
//-----------------------------------------------------------------------------
// Deleting a campground
router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    req.flash("success", "The campground is successfully deleted");
    res.redirect("/campgrounds");
  })
);
//-----------------------------------------------------------------------------
module.exports = router;
