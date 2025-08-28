const express = require("express");
const router = express.Router();
const { userModel, validateCategory } = require("../models/user");
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

  
    if (!username || !email || !password) {
      res.send("username,email and password is require");
    }
    const user = await userModel.findOne({ email });
    if (user) {
      return res.send("already user is exited");
    }
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(password, salt);

    const newUser = await userModel.create({
      username,
      email,
      password: hash,
    });
    console.log(newUser);
    let token = jwt.sign({ username }, process.env.JWT_KEY);

    res.cookie("token", token).json({ message: "user created" });

    // return res.render('profile',{newUser})
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  let user = await userModel.findOne({ email });
  if (!user) return res.send("register first");

  bcrypt.compare(password, user.password, (error, result) => {
    if (result) {
      const token = jwt.sign({ email }, process.env.JWT_KEY);
      // res.cookie("token", token);
      // return res.redirect("/profile");
      res.cookie("token", token).json({ message: "user login" });
    } else {
      // res.redirect("/login");'
      res.status(404).json({ error: error.message });
    }
  });
});

router.get("/login", (req, res) => {
  res.render("user_login");
});




router.get("/profile", (req, res) => {
  if (!req.user) {
    return res.redirect("/auth/google");
  }
  res.send({ user: "users page" });
});





router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    // Destroying the session after logout
    req.session.destroy((err) => {
      if (err) return next(err);

      // Clearing the cookie
      res.clearCookie("connect.sid");

      // Redirecting to login page after successful logout
      // res.redirect("/users/login");
    });
  });
});

module.exports = router;
