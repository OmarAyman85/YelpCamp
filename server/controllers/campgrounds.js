const Campground = require("../models/campground");
//-----------------------------------------------------------------------------
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};
//-----------------------------------------------------------------------------
module.exports.renderNewForm = async (req, res) => {
  res.render("campgrounds/new");
};
//-----------------------------------------------------------------------------
module.exports.createCampground = async (req, res, next) => {
  const campground = new Campground(req.body.campgrounds);
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "A new campground is successfully made");
  res.redirect(`/campgrounds/${campground._id}`);
};
//-----------------------------------------------------------------------------
module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");
  if (!campground) {
    req.flash("error", "campground is not found !!!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};
//-----------------------------------------------------------------------------
module.exports.renderEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "campground is not found !!!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};
//-----------------------------------------------------------------------------
module.exports.editCampground = async (req, res) => {
  const campground = await Campground.findByIdAndUpdate(req.params.id, {
    ...req.body.campgrounds,
  });
  req.flash("success", "The campground is successfully updated");
  res.redirect(`/campgrounds/${campground._id}`);
};
//-----------------------------------------------------------------------------
module.exports.deleteCampground = async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "The campground is successfully deleted");
  res.redirect("/campgrounds");
};
//-----------------------------------------------------------------------------
