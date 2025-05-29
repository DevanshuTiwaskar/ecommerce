// var GoogleStrategy = require("passport-google-oauth20").Strategy;
// const { userModel } = require("../models/user");
// const passport = require("passport");

// ///google auth config it is used to authenticate the user using google
// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: process.env.GOOGLE_CALLBACK_URL,
//     },
//     async function (accessToken, refreshToken, profile, cb) {
//       console.log(profile, "google");
//       try {
//         const user = await userModel.findOne({
//           email: profile.emails[0].value,
//         });
//         if (!user) {
//           const newUser = new userModel({
//             name: profile.displayName,
//             email: profile.emails[0].value,
//           });

//           await newUser.save();
//           cb(null, user);
//         }
//       } catch (err) {
//         cb(err, false);
//       }
//     }
//   )
// );

// ///serialize user id to session it is used to save the user id in the session
// passport.serializeUser(function (user, cb) {
//   return cb(null, user._id);
// });

// ///deserialize user id from session it is used to get the user id from the session
// passport.deserializeUser(async function (id, cb) {
//   let user = await userModel.findOne({ _id: id });
//   cb(null, user);
// });

// module.exports = passport;



const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { userModel } = require("../models/user");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {   
      // console.log("Google Profile: ", profile);
      try {
        let user = await userModel.findOne({ email: profile.emails[0].value });///find user by email [0] is used to get the first email

        if (!user) { ///if user not found then create a new user
          user = new userModel({
            username: profile.displayName,
            email: profile.emails[0].value,
          });
          await user.save();
        }

        cb(null, user);
      } catch (err) {
        cb(err, null);
      }
    }
  )
);

passport.serializeUser((user, cb) => {
  cb(null, user._id);                    ///this save the user id in the session
});

passport.deserializeUser(async (id, cb) => { ///this get the user id from the session
  try {
    const user = await userModel.findById(id);
    if (!user) return cb(new Error("User not found"), null);
    cb(null, user);
  } catch (err) {
    cb(err, null);
  }
});

module.exports = passport;

