

const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = Schema(
  {
    number: {
      type: String,
      required: true,
    },
    secoundnumber: {
      type: String,
      default: null
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
    other: {
      viewjob: { type: Number, default: 0 },
      cvsend:{ type: Number, default: 0 },
      totalchat: { type: Number, default: 0 },
      savejob: { type: Number, default: 0 },
      carearpre: { type: Number, default: 0 },
      total_step: { type: Number, default: 7 },
      incomplete: { type: Number, default: 5 },
      complete: { type: Number, default: 2 },

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
      },
      job_hunting: {
        type: String,
        default: null
      },
      more_status: {
        type: String,
        default: null
      },
      job_right_now: {
        type: Boolean,
        default: false
      },
    },
    email: String,
    image: String,
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
