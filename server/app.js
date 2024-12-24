const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Campground = require("./models/campground");

dotenv.config();
const PORT = process.env.PORT || 5001;

mongoose.connect(process.env.MONGO_URL, {
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => console.log("Database connected"));

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});

app.listen(PORT || 5000, () => {
  console.log(`serving on port: ${PORT}`);
});
