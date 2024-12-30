const express = require("express");
const catchAsync = require("../utils/catchAsync");
const usersC = require("../controllers/users");
//-----------------------------------------------------------------------------
const router = express.Router();
//-----------------------------------------------------------------------------
router.get("/register", usersC.renderNewUserForm);
router.post("/register", catchAsync(usersC.createUser));
//-----------------------------------------------------------------------------
router.get("/login", usersC.renderLoginForm);
router.post("/login", usersC.login);
//-----------------------------------------------------------------------------
router.get("/logout", catchAsync(usersC.logout));
//-----------------------------------------------------------------------------
module.exports = router;
