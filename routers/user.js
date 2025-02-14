const express = require("express");
const router = express.Router();
const { userModel, validateCategory } = require("../models/user");

router.get("/login", (req, res) => {
    res.render("user_login");
});

router.get("/profile", (req, res) => {
  if (!req.user) {
    return res.redirect("/auth/google");
  }
  res.send({ user: "users page" });
});

router.get("logout",(req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
      req.session.destroy((err)=>{
        req.clearCookie("connect.sid");
        res.redirect("/users/login")
      })
    
})

module.exports = router; 
