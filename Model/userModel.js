

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
    experiencedlevel:{
      type: "ObjectId",
      ref: "Experience"
    },
    startedworking: Date,
    deatofbirth: Date,
    viewjob: { type: Number, default: 0 },
    cvsend:{ type: Number, default: 0 },
    totalchat: { type: Number, default: 0 },
    savejob: { type: Number, default: 0 },
    carearpre: { type: Number, default: 0 },
    total_step: { type: Number, default: 7 },
    incomplete: { type: Number, default: 7 },
    complete: { type: Number, default: 0 },
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

var User = model("User", userSchema);

module.exports = User;
