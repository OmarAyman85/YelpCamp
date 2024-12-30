const express = require("express");
const campgroundsC = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const { validateCampground, isLoggedIn, isAuthor } = require("../middleware");
//-----------------------------------------------------------------------------
const router = express.Router();
//-----------------------------------------------------------------------------
router
  .route("/")
  .get(catchAsync(campgroundsC.index))
  .post(
    isLoggedIn,
    validateCampground,
    catchAsync(campgroundsC.createCampground)
  );
//-----------------------------------------------------------------------------
router.get("/new", isLoggedIn, campgroundsC.renderNewForm);
//-----------------------------------------------------------------------------
router
  .route("/:id")
  .get("/:id", catchAsync(campgroundsC.showCampground))
  .put(
    "/:id",
    isLoggedIn,
    isAuthor,
    validateCampground,
    catchAsync(campgroundsC.editCampground)
  )
  .delete(
    "/:id",
    isLoggedIn,
    isAuthor,
    catchAsync(campgroundsC.deleteCampground)
  );
//-----------------------------------------------------------------------------
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgroundsC.renderEditForm)
);
//-----------------------------------------------------------------------------
module.exports = router;
