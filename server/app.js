const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
//-----------------------------------------------------------------------------
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");
const User = require("./models/user");
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
app.use(express.static(path.join(__dirname, "public")));
//-----------------------------------------------------------------------------
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //------------------milliseconds*seconds*minutes*hours*days = one week-----
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
//-----------------------------------------------------------------------------
app.use(flash());
//-----------------------------------------------------------------------------
app.use(passport.initialize());
app.use(passport.session());
//-----------------------------------------------------------------------------
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//-----------------------------------------------------------------------------
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
//-----------------------------------------------------------------------------
app.use("/", userRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);
//-----------------------------------------------------------------------------
// General request
app.get("/", (req, res) => {
  res.render("home");
});
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
