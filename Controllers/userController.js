const bcrypt = require("bcrypt");
const _ = require("lodash");
const axios = require("axios");
const otpGenerator = require("otp-generator");

const { User } = require("../Model/userModel");
const { Otp } = require("../Model/otpModel");
const { response } = require("express");


function getRandomInt(max) {
  return Math.floor(Math.random() * 9000 + 1000);
}
module.exports.singUp = async (req, res) => {
  const user = await User.findOne({
    number: req.body.number,
  });
  if (user) return res.status(400).send("User already registered!");
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
};
module.exports.verifyOtp = async (req, res) => {
  const otpHolder = await Otp.find({
    number: req.body.number,
  });
  if (otpHolder.length === 0)
    return res.status(400).send("You use an Expired OTP!");
  const rightOtpFind = otpHolder[otpHolder.length - 1];
  const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);
  if (rightOtpFind.number === req.body.number && validUser) {
    const user = new User(_.pick(req.body, ["number"]));
    const token = user.generateJWT();
    const result = await user.save();
    const OTPDelete = await Otp.deleteMany({
      number: rightOtpFind.number,
    });
    return res.status(200).json({
      message: "User Registration Successfully!",
      token: token,
      data: result,
    });
  } else {
    return res.status(400).send("Your OTP was wrong!");
  }
};

module.exports.users = async (req, res) => {
  try {
    const usersData = await User.find();
    res.send(usersData);
  } catch (error) {
    res.send(error);
  }
};
// module.exports.singal = async (req, res) => {
//   try {
//     const _id = req.params.id;
//     const singalUser = await User.findOne(_id);
//     res.send(singalUser);
//   } catch (error) {
//     res.send(error);
//   }
// };
