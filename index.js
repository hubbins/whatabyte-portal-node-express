// index.js

/**
 * Required External Modules
 */

const express = require("express");
const path = require("path");
const expressSession = require("express-session");
const passport = require("passport");
const Auth0Strategy = require("passport-auth0");
const request = require("request");
const authRouter = require("./auth");

require("dotenv").config();

/**
 * App Variables
 */

const app = express();
const port = process.env.PORT || "8000";

/**
 * Session Configuration
 */

const session = {
  secret: process.env.SESSION_SECRET,
  cookie: {},
  resave: false,
  saveUninitialized: false
};

if (app.get("env") === "production") {
  // Serve secure cookies, requires HTTPS
  session.cookie.secure = true;
}

/**
 * Passport Configuration
 */

const strategy = new Auth0Strategy(
  {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL
  },
  function (accessToken, refreshToken, extraParams, profile, done) {
    /**
     * Access tokens are used to authorize users to an API
     * (resource server)
     * accessToken is the token to call the Auth0 API
     * or a secured third-party API
     * extraParams.id_token has the JSON Web Token
     * profile has all the information from the user
     */
    const info = {
      "profile": profile,
      "id_token": extraParams.id_token
    };
    return done(null, info);
  }
);

/**
 *  App Configuration
 */

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

app.use(expressSession(session));
passport.use(strategy);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Creating custom middleware with Express
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

// Router mounting
app.use("/", authRouter);

/**
 * Routes Definitions
 */

const secured = (req, res, next) => {
  if (req.user) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  res.redirect("/login");
};

app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/user", secured, (req, res, next) => {
  const { _raw, _json, ...userProfile } = req.user.profile;

  let options = {
    method: 'GET',
    url: "https://auth0-validate-jwt.glitch.me/api/private",
    headers: { authorization: 'Bearer ' + req.user.id_token }
  };

  request(options, function (error, response, body) {
    if (error) throw new Error(error);
  
    console.log(body);
    let payload = JSON.parse(body);

    res.render("user", {
      title: "Profile",
      userProfile: userProfile,
      userName: payload.name,
      mstarId: payload.mstarId
    });
  });

});

/**
 * Server Activation
 */

app.listen(port, () => {
  console.log(`Listening to requests on http://${process.env.DOMAIN}:${port}`);
});
