const express = require("express");
const app = express();
const Recruiters = require("../../Model/Recruiter/recruiters");
const tokenverify = require("../../MiddleWare/tokenverify.js");
const jwt = require("jsonwebtoken");
const { Otp } = require("../../Model/otpModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const smtppool = require("nodemailer");
const {
  CompanyVerify,
} = require("../../Model/Recruiter/Verify/company_verify.js");
const {
  ProfileVerify,
} = require("../../Model/Recruiter/Verify/profile_verify.js");
const transportar = nodemailer.createTransport({
  // service: "gmail",
  // auth: {
  //     "user": "bringin.sdk@gmail.com",
  //     "pass": "ovzkmudorqbzttju"
  // }
  host: "mail.bringin.io",
  port: 465,
  auth: {
    user: "notifications@bringin.io",
    pass: "@Notifications.1995",
  },
});

function getRandomInt(max) {
  return Math.floor(Math.random() * 9000 + 1000);
}

const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post("/company_verify", tokenverify, upload.single("image"), (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        var verifydata = await CompanyVerify.findOne({ userid: _id });
        if (verifydata == null) {
          await CompanyVerify({
            userid: _id,
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            encoding: req.file.encoding,
            mimetype: req.file.mimetype,
            destination: req.file.destination,
            filename: req.file.filename,
            path: req.file.path,
            size: req.file.size,
          }).save();
          await Recruiters.findByIdAndUpdate(
            { _id: _id },
            { $set: { "other.company_docupload": true } }
          );
          res.status(200).send("file upload successfull");
        } else {
          await CompanyVerify.findOneAndUpdate(
            { userid: _id },
            {
              $set: {
                fieldname: req.file.fieldname,
                originalname: req.file.originalname,
                encoding: req.file.encoding,
                mimetype: req.file.mimetype,
                destination: req.file.destination,
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size,
              },
            }
          );
          await Recruiters.findByIdAndUpdate(
            { _id: _id },
            { $set: { "other.company_docupload": true } }
          );
          res.status(200).send("file reupload successfull");
        }
      }
    });
  } catch (error) {
    res.status(404).send(error);
  }
});

app.post(
  "/profile_verify",
  tokenverify,
  upload.single("image"),
  async (req, res) => {
    try {
      jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
        if (err) {
          res.json({ message: "invalid token" });
        } else {
          const _id = authdata._id;
          if (req.body.type == 1) {
            const OTP = getRandomInt(4);
            console.log(OTP);
            const otp = await Otp({ number: authdata.number, otp: OTP });
            const salt = await bcrypt.genSalt(10);
            otp.otp = await bcrypt.hash(otp.otp, salt);
            await otp.save();
            const mailoption = {
              from: "notifications@bringin.io",
              to: req.body.email,
              subject: "Otp verify",
              text: `Otp is ${OTP}`,
              html: htmltext,
            };
            transportar.sendMail(mailoption, async (err, info) => {
              if (err) {
                res.status(400).send(err);
              } else {
                await Recruiters.findByIdAndUpdate(
                  { _id: _id },
                  { $set: { "other.profile_docupload": true } }
                );
                res.status(200).send("verification code send successfull");
              }
            });
          } else if (req.body.type == 5) {
            var verifydata = await ProfileVerify.findOne({ userid: _id });
            if (verifydata == null) {
              ProfileVerify({
                userid: _id,
                fieldname: null,
                originalname: null,
                encoding: null,
                mimetype: null,
                destination: null,
                filename: null,
                path: null,
                size: 0,
                type: req.body.type,
                link: req.body.link,
              }).save();
              await Recruiters.findByIdAndUpdate(
                { _id: _id },
                { $set: { "other.profile_docupload": true } }
              );
              res.status(200).send("send successfull");
            } else {
              await ProfileVerify.findOneAndUpdate(
                { userid: _id },
                {
                  $set: {
                    fieldname: null,
                    originalname: null,
                    encoding: null,
                    mimetype: null,
                    destination: null,
                    filename: null,
                    path: null,
                    size: 0,
                    type: req.body.type,
                    link: req.body.link,
                  },
                }
              );
              await Recruiters.findByIdAndUpdate(
                { _id: _id },
                { $set: { "other.profile_docupload": true } }
              );
              res.status(200).send("send successfull");
            }
          } else {
            var verifydata = await ProfileVerify.findOne({ userid: _id });
            if (verifydata == null) {
              ProfileVerify({
                userid: _id,
                fieldname: req.file.fieldname,
                originalname: req.file.originalname,
                encoding: req.file.encoding,
                mimetype: req.file.mimetype,
                destination: req.file.destination,
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size,
                type: req.body.type,
                link: "",
              }).save();
              await Recruiters.findByIdAndUpdate(
                { _id: _id },
                { $set: { "other.profile_docupload": true } }
              );
              res.status(200).send("send successfull");
            } else {
              await ProfileVerify.findOneAndUpdate(
                { userid: _id },
                {
                  $set: {
                    fieldname: req.file.fieldname,
                    originalname: req.file.originalname,
                    encoding: req.file.encoding,
                    mimetype: req.file.mimetype,
                    destination: req.file.destination,
                    filename: req.file.filename,
                    path: req.file.path,
                    size: req.file.size,
                    type: req.body.type,
                    link: "",
                  },
                }
              );
              await Recruiters.findByIdAndUpdate(
                { _id: _id },
                { $set: { "other.profile_docupload": true } }
              );
              res.status(200).send("send successfull");
            }
          }
        }
      });
    } catch (error) {
      res.status(404).send(error);
    }
  }
);

app.post("/email_code_verify", tokenverify, (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const otpHolder = await Otp.find({
          number: authdata.number,
        });
        if (otpHolder.length === 0)
          return res.status(400).send("You use an Expired OTP!");
        const rightOtpFind = otpHolder[otpHolder.length - 1];
        const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);
        if (rightOtpFind.number === authdata.number && validUser) {
          const OTPDelete = await Otp.deleteMany({
            number: rightOtpFind.number,
          });
          await Recruiters.findByIdAndUpdate(
            { _id: _id },
            { $set: { "other.profile_verify": true } }
          );
          return res.status(200).json({
            message: "Verified Succefully",
          });
        } else {
          return res.status(400).send("Your OTP was wrong!");
        }
      }
    });
  } catch (error) {
    res.status(404).send(error);
  }
});

let htmltext = `


<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <section style="display: flex; justify-content: center;">
    <div style="width: 600px;">
      <header>
        <div
        style=" display: flex;
         margin-top: 10px;"
        >
          <div><img style="margin-top: 5px;" src="https://i.ibb.co/fkTskDV/Group-23.png" alt="logo" /></div>
          <div>
            <h1 style="color:#0077B5; font-size: 20px; font-weight: 700; margin-left: 150px;">
              Instant Chat - Hire Direct
            </h1>
          </div>
        </div>
        <div style="padding: 5px;">
          <hr />
        </div>
      </header>
      <div>
        <div style="text-align: center; margin-top: 10px;">
          <h1 style="font-size: 24px; font-weight: 600; color:#0077B5;">Confirm your work email</h1>
        </div>
      </div>

      <div>
        <p style="font-size: 18px; color: #564E4E;">
          Hi <span  style="font-size: 18px; font-weight: 600;">Bayzid Isalm,</span>
        </p>
        <p style="font-size: 18px; color: #564E4E;">
          To verify your email address for Bringin Recruiter Account,<br />
          enter the following code:
        </p>
      </div>
     
<h1 style="font-size: 22px; font-weight: 700px; color: white;   text-align: center; background-color:#0077B5; width: 120px; height:40px; padding-top: 15px; margin-left: 240px; border-radius: 5px;">
  8577
</h1>
     

      <div>
        <p style="font-size: 18px; color: #564E4E; margin-bottom: 2px;">
          If you didn't request this code, you can ignore this mail!
        </p>
        <p style="font-size: 18px; color: #564E4E;">
          This is an automatically generated email. Please note that this
          email address is not actively monitored, and any responses may not
          be received or reviewed promptly.
        </p>

        <div style="margin-top: 5px; margin-bottom: 5px;">
          <p style="font-size: 18px; color: #564E4E;">Have a question?</p>
          <p style="font-size: 18px; color: #564E4E;">
            Check out our help center or contact us in the app using
          </p>

          <a href="https://wa.me/+8801756175141?text=Hii..." target="_blank">
          <p style="color: #564E4E;"> Profile > Contact Us   </p>   
          </a>
        </div>
      </div>

<div class="my-7 px-24">
  <div class="bg-[#DBDBDB] h-[1px]"></div>

</div>

<div>

<div style="text-align: center; ">
  <p style="font-size: 14px; font-weight: 700px;">Bringin <a href="https://bringin.io/privacypolicy" target="_blank">
      <span style="color: #0077B5"> Privacy Policy   </span>   
      </a></p>
  <p style="font-size: 14px; font-weight: 700px;">Plot 25, Road 04, Sector 10, Uttara, Dhaka – 1230.</p>
</div>

<div style=" margin-left: 200px;">
  <div style=" display: flex;


 gap: 5px; margin-top: 7px; margin-bottom: 7px;">
  <a href="https://wa.me/+8801756175141?text=Hii..." target="_blank">
      <img
       alt="bringin image" style="width: 30px; height: 30px;" 
       src="https://i.ibb.co/4201dS8/Group.png" 
       
       ></img>
    </a>
  <a href="https://www.facebook.com/bringin.io" target="_blank">
      <img alt="bringin image" style="width: 30px; height: 30px; 
      "
      src="https://i.ibb.co/xsTyVhq/Vector.png" 
      ></img>
    </a>
  <a href="https://www.instagram.com/bringin.io/" target="_blank">
      <img alt="bringin image" style="width: 30px; height: 30px; " src="https://i.ibb.co/nwBnZfy/Group-1.png" ></img>
    </a>
  <a href="https://www.linkedin.com/company/bringinapp" target="_blank">
      <img alt="bringin image" style="width: 30px; height: 30px; " src="https://i.ibb.co/6YhLy3Z/Group-2.png"></img>
    </a>
  <a href="https://www.youtube.com/@Bringinapp" target="_blank">
      <img alt="bringin image" style="width: 30px; height: 30px; " src="https://i.ibb.co/486N9CK/Group-28.png" ></img>
    </a>
  <a href="https://twitter.com/bringinapp" target="_blank">
      <img alt="bringin image" style="width: 30px; height: 30px; "  src="https://i.ibb.co/cgn4v7x/Group-3.png"></img>
    </a>
</div>
</div>

</div>


    </div>
  </section>
</body>
</html>
`;

module.exports = app;
