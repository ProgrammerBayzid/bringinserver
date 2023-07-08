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
        companyname: {
            type: "ObjectId",
            ref: "Company"
        },
        designation: String,
        email: String,
        image: String,
        company_verify: Boolean,
        profile_verify: Boolean,
        company_docupload: Boolean,
        profile_docupload: Boolean,
        profile_verify_date: {
          type: Date, 
          default: new Date()
        },
        premium: Boolean,
        total_chat: {
          type: Number,
          default: 0
        },
        savecandidate: {
          type: Number,
          default: 0
        },
        interview: {
          type: Number,
          default: 0
        },
        total_step: { type: Number, default: 6 },
        incomplete: { type: Number, default: 1 },
        complete: { type: Number, default: 5 },
        pushnotification: String,
        notification: {
          push_notification: {
            type: Boolean,
            default: false
          },
          whatsapp_notification: {
            type: Boolean,
            default: false
          },
          sms_notification: {
            type: Boolean,
            default: false
          },
          job_recommandation: {
            type: Boolean,
            default: false
          }
        }
    },{timestamps: true}

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
