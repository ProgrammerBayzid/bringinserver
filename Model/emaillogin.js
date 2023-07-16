const { Schema, model } = require("mongoose");

const userSchema = Schema({
  displayName: String,
  email: String,
  photoURL: String,
  addAdmin: Boolean,
  webAdmin: Boolean,
  admin: Boolean,
});
var email = model("Email", userSchema);

module.exports = {
  email,
};
