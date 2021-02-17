const express = require("express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const session = require("express-session");
var mongoose = require("mongoose");
const passport = require("passport");
const passportLocal = require("./passportLocal");
const User = require("./db/models/users.js");
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

mongoose.connect(
    "mongodb+srv://ghofrane:291220fafou@authentication.p1p75.mongodb.net/authentication",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    },
    { useMongoClient: true }
  );

  mongoose.connection
  .once("open", () => console.log("Connected to the database!"))
  .on("error", (err) => console.log("Error", err));


 
passportLocal(passport, User.getUserByEmail, User.getUserById);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize()); 
app.use(passport.session()); 

app.get("/user", (req, res) => {
  console.log({ user: req.user });
  res.json({ user: req.user });
});
app.post("/login", passport.authenticate("local"), function(req, res) {
  res.json({ user: req.user });
});
app.post("/register", checkNotAuthenticated, async (req, res) => {
  let { username, email, password } = req.body;
  try {
    user = await User.save({ username, email, password });
    passport.authenticate("local")(req, res, function() {
      res.json({ user: req.user });
    });
  } catch (e) {
    console.log(e);
    res.redirect("/register");
  }
});
app.delete("/logout", (req, res) => {
  req.logOut();
  res.sendStatus(204);
});
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}


module.exports = {
    path: "/api",
    handler: app
  };