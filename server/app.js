const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
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
