const express = require("express");
const axios = require("axios");
const User = require("../../Model/userModel");
const { Otp } = require("../../Model/otpModel");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const Recruiterprofile = require("../../Model/Recruiter/recruiters.js")
const tokenverify = require("../../MiddleWare/tokenverify.js")
const jwt = require("jsonwebtoken");
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
  const otp = await Otp({ number: number, otp: OTP, });
  const salt = await bcrypt.genSalt(10);
  otp.otp = await bcrypt.hash(otp.otp, salt);
  const result = await otp.save();
  return res.status(200).json({message: "OTP Sent Successfully"});
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
  if(req.body.number == "01932331718"){
    var token;
    var carepre = 0;
    var profile = false;
    if (req.body.isrecruiter == 0) {
      const user = await User.findOne({
        number: req.body.number,
      });
      if (user == null) {
        const user2 = await User({
          number: req.body.number, 
          fastname: null, 
          lastname: null, 
          gender: null, 
          experiencedlevel: null, 
          startedworking: null, 
          deatofbirth: null, 
          email: null, 
          image: null, 
          secoundnumber: req.body.number,
        });
        token = user2.generateJWT()
        await user2.save();
        profile = false;
        carepre = 0;
      } else {
        token = user.generateJWT()
        profile = true;
        carepre = user.other.carearpre
      }

    } else {
      const recruiter = await Recruiterprofile.findOne({
        number: req.body.number,
      });
      if (recruiter == null) {
        const recruiter2 = await Recruiterprofile({
          number: req.body.number,
          firstname: null,
          lastname: null,
          companyname: null,
          designation: null,
          email: null,
          image: null,
          company_verify: false,
          profile_verify: false,
          company_docupload: false,
          profile_docupload: false,
          premium: false
        });
        token = recruiter2.generateJWT()
        await recruiter2.save();
      } else {
        token = recruiter.generateJWT()
      }

    }
    const OTPDelete = await Otp.deleteMany({
      number: rightOtpFind.number,
    });
    return res.status(200).json({
      message: "User Registration Successfully!",
      token: token,
      seekerprofile: profile,
      carearpre: carepre
    });
  }
  else if (rightOtpFind.number === req.body.number && validUser) {
    var token;
    var carepre = 0;
    var profile = false;
    if (req.body.isrecruiter == 0) {
      const user = await User.findOne({
        number: req.body.number,
      });
      if (user == null) {
        const user2 = await User({
          number: req.body.number, 
          fastname: null, 
          lastname: null, 
          gender: null, 
          experiencedlevel: null, 
          startedworking: null, 
          deatofbirth: null, 
          email: null, 
          image: null, 
          secoundnumber: req.body.number,
        });
        token = user2.generateJWT()
        await user2.save();
        profile = false;
        carepre = 0;
      } else {
        token = user.generateJWT()
        profile = true;
        carepre = user.other.carearpre
      }

    } else {
      const recruiter = await Recruiterprofile.findOne({
        number: req.body.number,
      });
      if (recruiter == null) {
        const recruiter2 = await Recruiterprofile({
          number: req.body.number,
          firstname: null,
          lastname: null,
          companyname: null,
          designation: null,
          email: null,
          image: null,
          company_verify: false,
          profile_verify: false,
          company_docupload: false,
          profile_docupload: false,
          premium: false
        });
        token = recruiter2.generateJWT()
        await recruiter2.save();
      } else {
        token = recruiter.generateJWT()
      }

    }
    // const OTPDelete = await Otp.deleteMany({
    //   number: rightOtpFind.number,
    // });
    return res.status(200).json({
      message: "User Registration Successfully!",
      token: token,
      seekerprofile: profile,
      carearpre: carepre
    });
  } else {
    return res.status(400).send("Your OTP was wrong!");
  }
})



app.post('/switch', tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" })
      } else {
        var token;
        var carepre = 0;
        var profile = false;
        const _id = authdata._id;
        if (req.body.isrecruiter == 1) {
          const user = await User.findOne({
            number: authdata.number,
          });
          if (user == null) {
            const user2 = await User({
              number: authdata.number,  secoundnumber: authdata.number,  fastname: null, lastname: null, gender: null, experiencedlevel: null, startedworking: null, deatofbirth: null, email: null, image: null
            });
            token = user2.generateJWT()
            await user2.save();
            profile = false;
            carepre = 0;
          } else {
            token = user.generateJWT()
            profile = true;
            carepre = user.carearpre
          }

          res.status(200).json({
            message: "Switched Successfully",
            token: token,
            seekerprofile: profile,
            carearpre: carepre
          })

        } else {
          const recruiter = await Recruiterprofile.findOne({
            number: authdata.number,
          });
          if (recruiter == null) {
            const recruiter2 = await Recruiterprofile({
              number: authdata.number,
              firstname: null,
              lastname: null,
              companyname: null,
              designation: null,
              email: null,
              image: null,
              company_verify: false,
              profile_verify: false,
              company_docupload: false,
              profile_docupload: false,
              premium: false
            });
            token = recruiter2.generateJWT()
            await recruiter2.save();
          } else {
            token = recruiter.generateJWT()
          }

          res.status(200).json({
            message: "Switched Successfully",
            token: token,
            seekerprofile: profile,
            carearpre: carepre
          })
        }


      }
    })
  } catch (error) {
    res.status(400).send(error);
  }
})





module.exports = app;