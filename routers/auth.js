const express = require("express");
const router = express.Router();
const passport = require("passport");

///google auth route it is used to authenticate the user using google
// router.get(
//   "/google",
//   passport.authenticate("google", { scope: ["profile", "email"] }),
//   (req, res) => {
//     res.send("user authenticated");
//   }
// );

// router.get(
//   "/google/callback",
//   passport.authenticate("google", {
//     successRedirect: "/users/profile",
//     failureRedirect: "/",
//   }),
//   function (req, res) {
//     res.send("user authenticated");
//   }
// );



router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { 
    successRedirect: "/products",
    failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/users/profile");
  }
);


router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

module.exports = router;
