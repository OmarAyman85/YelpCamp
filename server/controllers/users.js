const User = require("../models/user");
const passport = require("passport");
//-----------------------------------------------------------------------------
module.exports.renderNewUserForm = (req, res) => {
  res.render("users/register");
};
//-----------------------------------------------------------------------------
module.exports.createUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", `You are registered, WELCOME ${username} !!!`);
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};
//-----------------------------------------------------------------------------
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};
//-----------------------------------------------------------------------------
module.exports.login = (req, res, next) => {
  const currentSessionReturnTo = req.session.returnTo;
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash("error", "Invalid credentials");
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      const redirectUrl = currentSessionReturnTo || "/campgrounds";
      delete req.session.returnTo;
      res.redirect(redirectUrl);
    });
  })(req, res, next);
};
//-----------------------------------------------------------------------------
module.exports.logout = async (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
  });
  req.flash("success", "Goodbye!!!");
  res.redirect("/campgrounds");
};
//-----------------------------------------------------------------------------
