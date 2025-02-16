const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Order Schema with Validation
const orderSchema = mongoose.Schema({
   orderId:{ 
    type: String,
    required: true
   },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true,
        },
    ],
    totalPrice: {
        type: Number,
        required: true,
        min: 0, // Non-negative value
    },
    address: {
        type: String,
        minlength:5,
        mixlength:255
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending",
    },
    payment: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "payment",
        },
    ],
    delivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "delivery",
    },
});

// Mongoose Model
const orderModel = mongoose.model("order", orderSchema);

// Joi Validation Function
const validateOrder = (data) => {
    const schema = Joi.object({
        user: Joi.string().required(), // Expecting a valid ObjectId as a string
        products: Joi.array().items(Joi.string().required()).min(1).required(), // Array of ObjectId strings
        totalPrice: Joi.number().min(0).required(),
        status: Joi.string()
            .valid("pending", "confirmed", "shipped", "delivered", "cancelled")
            .required(),
        payment: Joi.array().items(Joi.string()).optional(), // Array of ObjectId strings
        delivery: Joi.string().optional(), // ObjectId string
    });

    return schema.validate(data);
};

module.exports = { orderModel, validateOrder };
