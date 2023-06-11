const express = require("express");
const axios = require("axios");
const { User } = require("../../Model/userModel");
const { Otp } = require("../../Model/otpModel");
const bcrypt = require("bcrypt");
const _ = require("lodash");

const app = express();


function getRandomInt(max) {
    return Math.floor(Math.random() * 9000 + 1000);
  };

app.post("/singup", async (req, res) => {
    const OTP = getRandomInt(4);
    const number = req.body.number;
    console.log(OTP);
    axios
      .post(
        `http://bulksmsbd.net/api/smsapi?api_key=${process.env.SMS_KEY}&type=text&number=${number}&senderid=8809617611096&message=Bringin+Verification+Code+is+${OTP}`
      )
      .then((response) => {
        console.log(response.data);
      });
    const otp = await  Otp({ number: number, otp: OTP,  });
    const salt = await bcrypt.genSalt(10);
    otp.otp = await bcrypt.hash(otp.otp, salt);
    const result = await otp.save();
    return res.status(200).send("Otp send successfully");
  });




  // # post verify code 

  app.post('/verify', async (req, res) => {
    const otpHolder = await Otp.find({
      number: req.body.number,
    });
    if (otpHolder.length === 0)
      return res.status(400).send("You use an Expired OTP!");
    const rightOtpFind = otpHolder[otpHolder.length - 1];
    const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);
    if (rightOtpFind.number === req.body.number && validUser) {
      var token;
      // const user = new User(_.pick(req.body, ["number"]));
      const user = await User.findOne({
        number: req.body.number,
      });
      if (user == null) {
        const user2 = await User({number:req.body.number, fastname: null,lastname: null, gender: null, experiencedlevel: null, startedworking:null, deatofbirth:null, email: null, image:null});
        token = user2.generateJWT()
        await user2.save();
      }else{
        token = user.generateJWT()
      }
      // const user = await User({number:req.body.number, fastname: "Tanvir",lastname: "mahamud", gender: "male"});
      // const token = user.generateJWT();
      // const result = await user.save();
      const OTPDelete = await Otp.deleteMany({
        number: rightOtpFind.number,
      });
      return res.status(200).json({
        message: "User Registration Successfully!",
        token: token,
        data: {},
      });
    } else {
      return res.status(400).send("Your OTP was wrong!");
    }
  })



module.exports = app;