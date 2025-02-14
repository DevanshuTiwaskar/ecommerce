const express = require("express");
const router = express.Router();
const { adminModel } = require("../models/admin");
const { productModel } = require("../models/product")
const { categoryModel } = require("../models/category")
const bcrypt = require("bcrypt");
const { validateAdmin } = require("../middlewares/admin");

const jwt = require("jsonwebtoken");

if (
  typeof process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV === "development"
) {
  router.get("/create", async (req, res) => {
    try {
      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash("admin", salt);

      let user = new adminModel({
        name: "devanshu",
        email: "admin@gmail.com",
        password: hash,
        role: "admin",
      });
      await user.save();

      let token = jwt.sign({ email: "admin@gmail.com",admin: true }, process.env.JWT_KEY);
      res.cookie("token", token);
      res.send("admin created sussfully");
    } catch (error) {
      res.send(error.message);
    }
  });
}

router.get("/login", async (req, res) => {
  res.render("admin_login");
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let admin = await adminModel.findOne({ email });
  if (!admin) return res.send("this admin is not available");

  let valid = await bcrypt.compare(password, admin.password);
  if (valid) {
    let token = jwt.sign({ email: "admin@gmail.com", admin: true }, process.env.JWT_KEY);
    res.cookie("token", token);
    res.redirect("/admin/dashboard");
  }
});

// router.get("/dashboard", validateAdmin, (req, res) => {
//   // res.render("admin_dashboard");
//   res.render("admin_dashboard");
// });


router.get("/dashboard", validateAdmin, async (req, res) => {
  try {
    let prodcount = await productModel.countDocuments();
    let categcount = await categoryModel.countDocuments();

    res.render("admin_dashboard", { prodcount, categcount });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).send("Internal Server Error");
  }
});





router.get("/products", validateAdmin, async (req, res) => {


  // Aggregate query to group products by category and limit to 10 products per category
    const result = await productModel.aggregate([
        {
            $group: {
                _id: "$category", // Group by category
                products: { $push: "$$ROOT" } // Push the entire product document into an array
            }
        },
        {
            $project: {
                _id: 0, // Exclude the _id field
                category: "$_id", // Rename _id to category
                products: { $slice: ["$products", 10] } // Limit to the first 10 products
            }
        }
    ]);

    // Convert the result array into the desired object format
    const formattedResult = {};
    result.forEach(item => {
        formattedResult[item.category] = item.products;// Assign the products array to the category key
    });
     
    // // Print the formatted result key is for category and value is for products
    // for(let key in formattedResult){
    //   console.log(formattedResult[key]) // this will print the products of each category
    // }



    // let product = await productModel.find()
    res.render("admin_products",{ products: formattedResult });
  });


router.get("/logout", validateAdmin, (req, res) => {
  res.cookie("token", "");
  res.redirect("/admin/login");
});

module.exports = router;
