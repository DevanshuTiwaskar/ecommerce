const mongoose = require("mongoose");
const Joi = require("joi");

// Address Schema for Mongoose
const addressSchema = mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip: { type: Number, required: true, min: 10000, max: 99999 }, // ZIP code validation
});

// User Schema for Mongoose
const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true, minlength: 3, maxlength: 50 },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /\S+@\S+\.\S+/,
    },
    password: { type: String },
    phone: { type: Number },
    addressess: { type: [addressSchema], required: true }, // Array of address schemas
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Create Mongoose Model
const userModel = mongoose.model("user", userSchema);

// Joi Validation Schema
const validateUser = (data) => {
  const addressSchema = Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zip: Joi.number().integer().min(10000).max(99999).required(),
  });

  const userSchema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.number().min(1000000000).max(9999999999).required(),
    addressess: Joi.array().items(addressSchema).required(),
  });

  return userSchema.validate(data);
};

module.exports = { userModel, validateUser };
