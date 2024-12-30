const express = require("express");
const catchAsync = require("../utils/catchAsync");
const usersC = require("../controllers/users");
//-----------------------------------------------------------------------------
const router = express.Router();
//-----------------------------------------------------------------------------
router
  .route("/register")
  .get(usersC.renderNewUserForm)
  .post(catchAsync(usersC.createUser));
//-----------------------------------------------------------------------------
router.route("/login").get(usersC.renderLoginForm).post(usersC.login);
//-----------------------------------------------------------------------------
router.get("/logout", catchAsync(usersC.logout));
//-----------------------------------------------------------------------------
module.exports = router;
