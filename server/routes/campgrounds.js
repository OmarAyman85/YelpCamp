const express = require("express");
const campgroundsC = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const Campground = require("../models/campground");
const { validateCampground, isLoggedIn, isAuthor } = require("../middleware");
//-----------------------------------------------------------------------------
const router = express.Router();
//-----------------------------------------------------------------------------
// Getting all the campgrounds
router.get("/", catchAsync(campgroundsC.index));
//-----------------------------------------------------------------------------
// Request for creating a new campground
// Reordered here before the getting by the ID because /new will be treated as an id not a route
router.get("/new", isLoggedIn, campgroundsC.renderNewForm);
// Creating new campground after submitting the form
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(campgroundsC.createCampground)
);
//-----------------------------------------------------------------------------
// Getting details of specific campground
router.get("/:id", catchAsync(campgroundsC.showCampground));
//-----------------------------------------------------------------------------
// Request for updating a campground
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgroundsC.renderEditForm)
);
// Updating an existing campground
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(campgroundsC.editCampground)
);
//-----------------------------------------------------------------------------
// Deleting a campground
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(campgroundsC.deleteCampground)
);
//-----------------------------------------------------------------------------
module.exports = router;
