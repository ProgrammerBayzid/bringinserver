const { Schema, model, } = require("mongoose");
const jwt = require("jsonwebtoken");

const recruitersSchema = Schema(
    {
        number: {
            type: String,
            required: true,
          },
        firstname: String,
        lastname: String,
        companyname: String,
        designation: String,
        email: String,
        image: String

    },

);


recruitersSchema.methods.generateJWT = function () {
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

  var recruiters = model("Recruiters_profile", recruitersSchema)

module.exports= recruiters;
