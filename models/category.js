const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Category Schema with Validation
const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        unique: true, // Ensure category names are unique
        trim: true,   // Removes extra spaces from both ends
    },     
});

// Mongoose Model
const categoryModel = mongoose.model("category", categorySchema);

// Joi Validation Function
const validateCategory = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
    });

    return schema.validate(data);
};

module.exports = { categoryModel, validateCategory };
