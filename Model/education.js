const { Schema, model } = require("mongoose");

const educationlavelSchema = Schema({
  institutename: String,
  educationallevel: String,
  subject: String,
  grade: String,
  starttoend: String,
});

module.exports.Education = model("Education", educationlavelSchema);
