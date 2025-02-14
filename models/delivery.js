const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Delivery Schema with Validation
const deliverySchema = mongoose.Schema({
    order: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "order",
            required: true,
        },
    ],
    deliveryBoy: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "in-transit", "delivered", "cancelled"], // Predefined statuses
        default: "pending",
    },
    trackingUrl: {
        type: String,
        required: false,
    },
    estimatedDeliveryTime: {
        type: Number,
        required: true,
        min: 1, // Must be a positive number (in hours or minutes)
    },
});

// Mongoose Model
const deliveryModel = mongoose.model("delivery", deliverySchema);

// Joi Validation Function
const validateDelivery = (data) => {
    const schema = Joi.object({
        order: Joi.array().items(Joi.string().required()).min(1).required(), // Array of ObjectId strings
        deliveryBoy: Joi.string().min(3).max(50).required(),
        status: Joi.string()
            .valid("pending", "in-transit", "delivered", "cancelled")
            .required(),
        trackingUrl: Joi.string().uri(),
        estimatedDeliveryTime: Joi.number().min(1).required(),
    });

    return schema.validate(data);
};

module.exports = { deliveryModel, validateDelivery };
