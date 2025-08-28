require("dotenv").config();
const express = require("express");
const router = express.Router();

const { paymentModel } = require("../models/payment");

const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

///// Creates a new Razorpay order and stores it in the database with a pending status.
router.post("/create/orderId", async (req, res) => {
  console.log("KEY_ID:", process.env.RAZORPAY_KEY_ID);
  console.log("KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);
  const options = {
    amount: 5000 * 100, // amount in smallest currency unit
    currency: "INR",
  };

  try {
    const order = await razorpay.orders.create(options);

    // Store order in the database
    const newPayment = await paymentModel.create({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      status: "pending",
    });

    if (!newPayment) {
      return res
        .status(500)
        .json({ error: "Failed to store order in database" });
    }

    res.json(order); // Send order details to client only once
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating order" });
  }
});

router.post("/api/payment/verify", async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
  const secret = process.env.RAZORPAY_KEY_SECRET;

  try {
    const {
      validatePaymentVerification,
    } = require("razorpay/dist/utils/razorpay-utils");

    const result = validatePaymentVerification(
      { order_id: razorpayOrderId, payment_id: razorpayPaymentId },
      signature,
      secret
    );
    if (result) {
      const payment = await paymentModel.findOne({
        orderId: razorpayOrderId,
        status: "pending",
      });
      payment.paymentId = razorpayPaymentId;
      payment.signature = signature;
      payment.status = "completed";
      await payment.save();
      res.json({ status: "success" });
    } else {
      res.status(400).send("Invalid signature");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error verifying payment");
  }
});

module.exports = router;
