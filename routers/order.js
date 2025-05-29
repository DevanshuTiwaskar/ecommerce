const express = require("express");
const router = express.Router();

const { paymentModel } = require("../models/payment");
const {} = require("../routers/order");
const crypto = require("crypto");
const { orderModel } = require("../models/order");
const { cartModel } = require("../models/cart");
const { userModel } = require("../models/user");

// router.get("/:userid/:orderid/:paymentid/:signature", async (req, res) => {
//   let paymentDetails = await paymentModel.findOne({
//     orderId: req.params.orderid,
//   });

//   if (!paymentDetails) return res.send("Sorry, this order does not exist");
//   if (
//     req.params.signature === paymentDetails.signature &&
//     req.params.paymentid === paymentDetails.paymentId
//   ) {
//     let cart = await cartModel.findOne({ user: req.params.userid });

//     const order = await orderModel.create({
//       orderId: req.params.orderid,
//       user: req.params.userid,
//       products: cart.products,
//       totalPrice: cart.total,
//       status: "pending",
//       payment: paymentDetails._id,
//     });

//     await userModel.purchaseHistory.push(order._id);

//     return res.redirect(`/map/${req.params.orderid}`);
//   } else return res.send("Invalid payment");
// });

router.get("/:userid/:orderid/:paymentid/:signature", async (req, res) => {
  try {
    let paymentDetails = await paymentModel.findOne({
      orderId: req.params.orderid,
    });

    if (!paymentDetails) return res.send("Sorry, this order does not exist");

    if (
      req.params.signature === paymentDetails.signature &&
      req.params.paymentid === paymentDetails.paymentId
    ) {
      let cart = await cartModel.findOne({ user: req.params.userid });

      const order = await orderModel.create({
        orderId: req.params.orderid,
        user: req.params.userid,
        products: cart.products,
        totalPrice: cart.total,
        status: "pending",
        payment: paymentDetails._id,
      });

      // Find the user first
      const user = await userModel.findById(req.params.userid);

      if (!user) return res.send("User not found");

      // Push the order ID to the purchaseHistory array
      user.purchaseHistory.push(order._id);

      // Save the updated user document
      await user.save();

      return res.redirect(`/map/${req.params.orderid}`);
    } else {
      return res.send("Invalid payment");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error");
  }
});





router.post("/address/:orderid", async (req, res) => {
  let order = await orderModel.findOne({ orderId: req.params.orderid });
  order.address = req.body.address;
  if (!order) return res.send("sorry this order does not exits");
  if (!req.body.address) return res.send(" you must provide an address");
  order.address = req.body.address;
  order.save();
  return res.redirect("/");
});

module.exports = router;
