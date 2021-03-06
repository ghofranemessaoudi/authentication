const express = require("express");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const app = express();

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/shop", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
const passport = require("passport");
const passportLocal = require("./passportLocal");
const User = require("./db/models/users.js");
passportLocal(passport, User.getUserByEmail, User.getUserById);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize()); 
app.use(passport.session());  

var checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return { username: false };
  }
};

app.get("/user", (req, res) => {
  if (req.isAuthenticated()) {
    let fields = ["_id", "username","lastName","phoneNumber", "email", "type", "image"];
    let user = fields.reduce((acc, cv) => {
      acc[cv] = req.user[cv];
      return acc;
    }, {});
    return res.send(user);
  } else {
    return res.send({ username: false });
  }
});

app.post("/login", passport.authenticate("local"), function(req, res) {
  res.json({ user: req.user });
});

app.post("/register", checkNotAuthenticated, async (req, res) => {
  let { username,lastName,phoneNumber, email, password } = req.body;
  try {
    user = await User.save({ username, lastName,phoneNumber, email, password });
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
   res.redirect("/login");
});
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

app.get("/images/:img", (req, res) => {
  res.sendFile(path.join(__dirname, "uploads", req.params.img));
});


var users = require("./routes/users.js");
app.use("/users", checkAuthenticated, users);

///////////////////////////////////////////////
const passportGoogle = require("./passportGoogle");
passportGoogle(passport);


app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

app.get(
  "/auth/google/redirect",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect("/");
  }
);
/////////////////////////////////////////////////////
module.exports = {
  path: "/api",
  handler: app
};