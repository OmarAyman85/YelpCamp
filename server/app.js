const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
//-----------------------------------------------------------------------------
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const campgrounds = require("./routes/campgrounds");
const reviews = require("./routes/reviews");
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
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});
//-----------------------------------------------------------------------------
app.use("/campgrounds", campgrounds);
app.use("/campgrounds/:id/reviews", reviews);
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
