const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Payment Schema with Validation
const paymentSchema = mongoose.Schema({
    orderId: {
        type: String,
        required: true,
      },
      paymentId: {
        type: String,
      },
      signature: {
        type: String,
      },
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        required: true,
      },
      status: {
        type: String,
        default: 'pending',
      },
});

// Mongoose Model
const paymentModel = mongoose.model("payment", paymentSchema);

module.exports = { paymentModel };
