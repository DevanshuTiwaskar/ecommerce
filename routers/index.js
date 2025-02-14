require("dotenv").config();
const express = require("express");
const router = express.Router();
const path = require("path")



require("../config/db");

router.get("/", (req, res) => {
  res.redirect("/products");


});




module.exports = router;




