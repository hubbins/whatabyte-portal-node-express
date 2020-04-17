/**
 * Required External Modules
 */
const express = require("express");
const router = express.Router();
const passport = require("passport");
const url = require("url");
const querystring = require("querystring");

require("dotenv").config();

/**
 * Routes Definitions
 */
router.get(
  "/login",
  passport.authenticate("auth0", {
    scope: "openid email profile realm_something",
  }),
  (req, res) => {
    console.log("In login");
    res.redirect("/");
  }
);

router.get("/callback", (req, res, next) => {
  passport.authenticate("auth0", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.redirect("/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      console.log("In callback");

      const returnTo = req.session.returnTo;
      delete req.session.returnTo;
      res.redirect(returnTo || "/");
    });
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logOut();
  let onGlitch = process.env.GLITCH === "1";

  console.log("In logout");

  let returnTo = (onGlitch ? "https" : req.protocol) + "://" + req.hostname;
  const port = req.connection.localPort;

  if (port !== undefined && port !== 80 && port !== 443 && !onGlitch) {
    returnTo =
      process.env.NODE_ENV === "production"
        ? `${returnTo}/`
        : `${returnTo}:${port}/`;
  }

  const logoutURL = new URL(`https://${process.env.AUTH0_DOMAIN}/logout`);

  const searchString = querystring.stringify({
    client_id: process.env.AUTH0_CLIENT_ID,
    returnTo: returnTo,
  });

  logoutURL.search = searchString;

  res.redirect(logoutURL);
});

/**
 * Module Exports
 */

module.exports = router;
