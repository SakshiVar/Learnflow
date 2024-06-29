const passport = require("passport");
const mongoose = require("mongoose");

const User = mongoose.model("users");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "497402549417-7t4ddf2q8mv4pp8136etgi08fhp4oada.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const newUser = {
        googleId: profile.id,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        email: profile.emails[0].value,
        image: profile.photos[0].value,
      };
      
      try {
        let user = await User.findOne({ email: newUser.email });
        if (user) {
          // User Exists
          console.log("EXISTS ", user);
          done(null, user);
        } else {
          // Sign Up for the first time
          user = await User.create(newUser);
          console.log("NEW ", user);
          done(null, user);
        }
      } catch (error) {
        console.log(error);
        done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
