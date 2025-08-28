const express = require("express");
const router = express.Router();
const { cartModel, validateCart } = require("../models/cart")
const {validateAdmin, userIsLoggedIn} = require("../middlewares/admin");
const { productModel } = require("../models/product");

router.get('/',userIsLoggedIn, async function(req,res){


//   res.send(req.session.passport.user)///this give user _id 
try {
    let cart = await cartModel.findOne({ user:req.session.passport.user }).populate("products")
 
    let cartDataStructure = {}

    cart.products.forEach((product) => {
        let key = product._id.toString();
        if(cartDataStructure[key]){
            cartDataStructure[key].quantity += 1;
        }else{
            cartDataStructure[key] = {
                ...product._doc,
                quantity: 1,
            }
        }
    })
    
    let finalArray = Object.values(cartDataStructure)

    let finalprice = cart.total + 34

    res.render("cart", { cart: finalArray, finalprice: finalprice, userid: req.session.passport.user  })
    
} catch (error) {
    res.send(error.message)
} 

})


router.get('/add/:id',userIsLoggedIn,async (req,res)=>{
    try {
     
        let cart = await cartModel.findOne({ user:  req.session.passport.user })
        let product = await productModel.findOne({_id: req.params.id})

        if(!cart){
            cart = await cartModel.create({   ///create new cart if user does not have cart
                user: req.session.passport.user,
                products: [req.params.id],
                total: Number(product.price)/// total = totalPrice
            })
        }else{
            cart.products.push(req.params.id);
            cart.total = Number(cart.total) + Number(product.price)//total = total + totalPrice

            await cart.save();
        }
   
   
   res.redirect("back");
   } catch (error) {
        res.send(error.message)
   }    
})

router.get('/remove/:id',userIsLoggedIn,async (req,res)=>{
    try {
     
        let cart = await cartModel.findOne({ user:  req.session.passport.user })
        let product = await productModel.findOne({_id: req.params.id})

        if(!cart){
            res.send("Something went wrong while removing item.")
        }else{
            let prodId = cart.products.indexOf(req.params.id);
            cart.products.splice(prodId, 1);
            cart.total = Number(cart.total) - Number(product.price)//total = total - totalPrice

            await cart.save();
        }
   
   
   res.redirect("back");
   } catch (error) {
        res.send(error.message)
   }    
})


router.get('/remove/:id',async (req,res)=>{
try {
    let cart = await cartModel.findOne({ user:  req.session.passport.user })
    if(!cart) return("Something went wrong while removing item.")
    let index = cart.products.indexOf(req.params.id); ///find the index of the product in the cart
     if(index !== -1)cart.products.splice(index, 1); ///(index !== -1) means if the product is in the cart then remove it 
     else return res.send("Item is not in cart.")
 

     await cart.save()
   res.redirect("back");
} catch (error) {
    res.send(error.message)
}
})


module.exports = router
