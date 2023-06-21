const { Schema, model } = require("mongoose");

const educationlavelSchema = Schema({
  name: String,
  email: String,
  password: String,
});

module.exports.Email = model("Email", educationlavelSchema);
