
const express = require("express");
const router = new express.Router();
const bcrypt = require("bcrypt");
const _ = require("lodash");
const axios = require("axios");
const otpGenerator = require("otp-generator");
const { User } = require("../Model/userModel");
const { Otp } = require("../Model/otpModel");
const { response } = require("express");
const { route } = require("../app");

function getRandomInt(max) {
  return Math.floor(Math.random() * 9000 + 1000);
}


// # post singup 
router.post("/singup", async (req, res) => {
  // const user = await User.findOne({
  //   number: req.body.number,
  // });
  // if (user) return res.status(400).send("User already registered!");
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
  const otp = new Otp({ number: number, otp: OTP });
  const salt = await bcrypt.genSalt(10);
  otp.otp = await bcrypt.hash(otp.otp, salt);
  const result = await otp.save();
  return res.status(200).send("Otp send successfully");
});


// # post verify code 

router.post('/singup/verify', async (req, res) => {
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
      const user2 = await User({number:req.body.number, fastname: "Tanvir",lastname: "mahamud", gender: "male"});
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



// # Get user 

router.get("/users", async (req, res) => {
  try {
    const usersData = await User.find();
    res.send(usersData);
  } catch (error) {
    res.send(error);
  }
});


// # get user by id 

router.get("/users/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const singalUser = await User.findById(_id);
    console.log(singalUser);
    res.send(singalUser);
  } catch (error) {
    res.send(error);
  }
});


// # update user data  

router.patch("/users/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    const updateUser = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
    });
    console.log(updateUser);
    res.send(updateUser);
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = router;
