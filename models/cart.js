const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Cart Schema with Validation
const cartSchema = mongoose.Schema({
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
    total: {
        type: Number,
        required: true,
        min: 0,
    },
});

// Mongoose Model
const cartModel = mongoose.model("cart", cartSchema);

// Joi Validation Function
const validateCart = (data) => {
    const schema = Joi.object({
        user: Joi.string().required(), // Expecting a valid ObjectId as a string
        products: Joi.array().items(Joi.string().required()).min(1).required(), // Array of ObjectId strings
        total: Joi.number().min(0).required(),
    });

    return schema.validate(data);
};

module.exports = { cartModel, validateCart };
