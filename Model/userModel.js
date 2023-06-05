const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = Schema(
  {
    number: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
   
  },
  { timestamps: true }
);

userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      number: this.number,
      lastName:this.lastName,
      firstName:this.firstName
      
      
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "7d" }
  );
  return token;
};

module.exports.User = model("User", userSchema);
