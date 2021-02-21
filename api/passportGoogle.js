const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("./db/models/users");

function initialize(passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          "620902958049-iv3dlhu14iengn0baj4prumpfkie3rk5.apps.googleusercontent.com",
        clientSecret: "7B_nsOQLwb0xnK4LBaEu5X-1",
        callbackURL: "/api/auth/google/redirect"
      },
      (accessToken, refreshToken, profile, done) => {
        User.findOne({ googleId: profile.id }).then(currentUser => {
          if (currentUser) {
            done(null, currentUser);
          } else {
            new User({
              googleId: profile.id,
              provider:"google",
              username:profile.displayName
            })
              .save()
              .then(newUser => {
                done(null, newUser);
              });
          }
        });
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id).then(user => {
      done(null, user);
    });
  });
}

module.exports = initialize;