

const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = Schema(
  {
    number: {
      type: String,
      required: true,
    },
    fastname:  String,
    lastname: String,
    gender: String,
    experiencedlevel:String,
    startedworking: String,
    deatofbirth: String,
    email: String,
    image: String
  
   
  },
  { timestamps: true }
);

userSchema.methods.generateJWT = function () {
  const token = jwt.sign(
    {
      _id: this._id,
      number: this.number,
     
      
      
    },
    process.env.ACCESS_TOKEN,
    { expiresIn: "7d" }
  );
  return token;
};

module.exports.User = model("User", userSchema);
