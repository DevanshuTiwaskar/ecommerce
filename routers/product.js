const express = require("express");
const router = express.Router();

const upload = require("../config/multer_config")

const { productModel, validateProduct, } = require("../models/product")
const { categoryModel, validateCategory } = require("../models/category")
const { cartModel, validateCart } = require("../models/cart")
0


const { validateAdmin, userIsLoggedIn } = require("../middlewares/admin");
const { userModel } = require("../models/user");
// const { products } = require("razorpay/dist/types/products");



// Get all products
router.get("/",userIsLoggedIn, async (req,res)=>{
   let SomethingInCart = false;
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


let cart = await cartModel.findOne({ user: req.session.passport.user})
if(cart && cart.products.length > 0) SomethingInCart = true;///check if there is something in the cart 

let rnproducts = await productModel.aggregate([{ $sample: { size:3 }}])//this for random products on the home page
 



// Convert the result array into the desired object format
const formattedResult = {};
result.forEach(item => {
    formattedResult[item.category] = item.products;// Assign the products array to the category key
});
    res.render("index", {
      products: formattedResult,
       rnproducts,
        SomethingInCart,
        cartCount: cart ? cart.products.length : 0 ///this is for the cart count
      }); 
});








router.get("/delete/:id",validateAdmin, async (req,res)=>{
  let prods = await productModel.findOneAndDelete({_id: req.params.id});
  return res.redirect('/admin/products');
});

router.post("/delete",validateAdmin, async (req,res)=>{
  let prods = await productModel.findOneAndDelete({_id: req.body.products_id});
  return res.redirect("back");
});




//
// router.post("/", upload.single("image"), async (req, res) => {
//     let { name, price, category, stock, description,image } = req.body;
  
//     // Validate product details
//     const validationResult = validateProduct({
//       name,
//       price,
//       category,
//       stock,
//       description,
//       image
//     });
//     // Check for validation errors
//     if (validationResult.error) {
//       return res.status(400).send(validationResult.error.message);
//     }
  
//       // Check if category exists, if not create it category
//      let iscategory = await categoryModel.findOne({name: category})
//      if(!iscategory){
//       await categoryModel.create({name: category})
//      }




//     // Proceed with product creation
//     try {
//       let product = await productModel.create({
//         name,
//         price,
//         category,
//         stock,
//         description,
//         image: req.file.buffer,
//       });
    
//       res.status(201).redirect(`/admin/dashboard`);
//     } catch (err) {
//       res.status(500).send("Internal Server Error");
//       console.error(err);
//     }
//   });
  


router.post("/", upload.single("image"), async (req, res) => {
    // Get product details from request body
    let { name, price, category, stock, description } = req.body;
    let image = req.file; // Get image from multer

    // Check if image is uploaded
    if (!image) {
        return res.status(400).send("Image is required");
    }

    // Validate product details
    const validationResult = validateProduct({
        name,
        price,
        category,
        stock,
        description,
        image: image.originalname // Pass original name for validation
    });

    // Check for validation errors
    if (validationResult.error) {
        return res.status(400).send(validationResult.error.message);
    }

    // Check if category exists, if not create it
    let iscategory = await categoryModel.findOne({ name: category });
    if (!iscategory) {
        await categoryModel.create({ name: category });
    }

    // Proceed with product creation
    try {
        let product = await productModel.create({
            name,
            price,
            category,
            stock,
            description,
            image: {
                data: image.buffer,
                contentType: image.mimetype
            }
        });

        res.status(201).redirect(`/admin/dashboard`);
    } catch (err) {
        res.status(500).send("Internal Server Error");
        console.error(err);
    }
});



router.get("/get-product-by-id/:id", userIsLoggedIn,async (req,res) => {

  console.log(req.user) 
  try {


    const product =await productModel.findById(req.params.id)
    res.render('profile',{user:req.user, product})
  } catch (error) {
    res.status(404).send(error.message)
  }
})


module.exports = router;
