const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const { campgroundsSchema } = require("./schemas");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const Campground = require("./models/campground");
//-----------------------------------------------------------------------------
dotenv.config();
const PORT = process.env.PORT || 5001;
//-----------------------------------------------------------------------------
mongoose.connect(process.env.MONGO_URL, {
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => console.log("Database connected"));
//-----------------------------------------------------------------------------
const app = express();
//-----------------------------------------------------------------------------
app.engine("ejs", ejsMate);
//-----------------------------------------------------------------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
//-----------------------------------------------------------------------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//-----------------------------------------------------------------------------
app.use(methodOverride("_method"));
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
// General request
app.get("/", (req, res) => {
  res.render("home");
});
//-----------------------------------------------------------------------------
// Getting all the campgrounds
app.get(
  "/campgrounds",
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render("campgrounds/index", { campgrounds });
  })
);
//-----------------------------------------------------------------------------
// Request for creating a new campground
// Reordered here before the getting by the ID because /new will be treated as an id not a route
app.get("/campgrounds/new", async (req, res) => {
  res.render("campgrounds/new");
});
// Creating new campground after submitting the form
app.post(
  "/campgrounds",
  validateCampground,
  catchAsync(async (req, res, next) => {
    const campground = new Campground(req.body.campgrounds);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
//-----------------------------------------------------------------------------
// Getting details of specific campground
app.get(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/show", { campground });
  })
);
//-----------------------------------------------------------------------------
// Request for updating a campground
app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);
// Updating an existing campground
app.put(
  "/campgrounds/:id",
  validateCampground,
  catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {
      ...req.body.campgrounds,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);
//-----------------------------------------------------------------------------
// Deleting an existing campground
app.delete(
  "/campgrounds/:id",
  catchAsync(async (req, res) => {
    await Campground.findByIdAndDelete(req.params.id);
    res.redirect("/campgrounds");
  })
);
//-----------------------------------------------------------------------------
app.all("*", (req, es, next) => {
  next(new ExpressError("Page Not Found !!!", 404));
});
//-----------------------------------------------------------------------------
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong !!!";
  res.status(statusCode).render("error", { err });
});
//-----------------------------------------------------------------------------
app.listen(PORT || 5000, () => {
  console.log(`serving on port: ${PORT}`);
});
//-----------------------------------------------------------------------------
