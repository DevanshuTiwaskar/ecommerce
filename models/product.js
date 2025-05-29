const mongoose = require("mongoose");
const Joi = require("joi");

const productSchema = mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 100 },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, minlength: 3, maxlength: 50 },
    stock: { type: Number, required: true, min: 0 },
    description: { type: String, required: true, maxlength: 500 },
    // image: { type: String, required: true }, 
    image: { data: Buffer, contentType: String }
});


const productModel = mongoose.model("product", productSchema);


const validateProduct = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        price: Joi.number().min(0).required(),
        category: Joi.string().min(3).max(50).required(),
        stock: Joi.number().min(0).required(),
        description: Joi.string().max(500).required(),
        image: Joi.string().optional(), 
    });

    return schema.validate(data);
};

module.exports = { productModel, validateProduct };
