const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Admin Schema with Validation
const adminSchema = mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 50 },
    email: { type: String, required: true, unique: true, match: /\S+@\S+\.\S+/ }, // Email validation with regex
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, enum: ["admin", "superadmin"], default: "admin", required: true }, // Role validation with enum
});

// Mongoose Model
const adminModel = mongoose.model("admin", adminSchema);

// Joi Validation Function
const validateAdmin = (data) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        role: Joi.string().valid("admin", "superadmin").required(),
    });

    return schema.validate(data);
};

module.exports = { adminModel, validateAdmin };
