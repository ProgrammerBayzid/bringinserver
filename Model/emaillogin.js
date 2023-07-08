const { Schema, model } = require("mongoose");

const educationlavelSchema = Schema({
  name: String,
  email: String,
  password: String,
},{timestamps: true});

module.exports.Email = model("Email", educationlavelSchema);
