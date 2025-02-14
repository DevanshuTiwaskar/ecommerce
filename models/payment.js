const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Payment Schema with Validation
const paymentSchema = mongoose.Schema({
    order: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "order",
            required: true,
        },
    ],
    amount: {
        type: Number,
        required: true,
        min: 0, // Non-negative value
    },
    method: {
        type: String,
        required: true,
        enum: ["credit_card", "debit_card", "UPI", "cash_on_delivery"], // Predefined payment methods
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "completed", "failed", "refunded"], // Payment statuses
        default: "pending",
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
        minlength: 8, // Ensures a minimum length for transaction IDs
    },
});

// Mongoose Model
const paymentModel = mongoose.model("payment", paymentSchema);

// Joi Validation Function
const validatePayment = (data) => {
    const schema = Joi.object({
        order: Joi.array().items(Joi.string().required()).min(1).required(), // Array of ObjectId strings
        amount: Joi.number().min(0).required(),
        method: Joi.string().required(),
        status: Joi.string().required(),
        transactionId: Joi.string().min(8).required(),
    });

    return schema.validate(data);
};

module.exports = { paymentModel, validatePayment };
