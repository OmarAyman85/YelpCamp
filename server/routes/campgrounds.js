const express = require("express");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Campground = require("../models/campground");
const { campgroundsSchema } = require("../schemas");
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
router.get("/new", async (req, res) => {
  res.render("campgrounds/new");
});
// Creating new campground after submitting the form
router.post(
  "/",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campgrounds);
    await campground.save();
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
    res.render("campgrounds/show", { campground });
  })
);
//-----------------------------------------------------------------------------
// Request for updating a campground
router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);
// Updating an existing campground
router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {
      ...req.body.campgrounds,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
//-----------------------------------------------------------------------------
// Deleting a campground
router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  })
);
//-----------------------------------------------------------------------------
module.exports = router;