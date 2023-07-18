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
              html: `
              <!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <section class="flex justify-center">
      <div class="w-[600px]">
        <header>
          <div class="flex justify-between items-center my-3">
            <div><img src="image/bringinlogo.svg" /></div>
            <div>
              <h1 class="text-[#0077B5] text-[20px] font-bold">
                Instant Chat - Hire Direct
              </h1>
            </div>
          </div>
          <div class="px-7">
            <hr />
          </div>
        </header>
        <div>
          <div class="text-center my-5">
            <h1 class="text-[24px] font-semibold">Confirm your work email</h1>
          </div>
        </div>

        <div>
          <p class="text-[18px] text-[#564E4E]">
            Hi <span class="text-[18px] font-semibold">${to},</span>
          </p>
          <p class="text-[18px] text-[#564E4E]">
            To verify your email address for Bringin Recruiter Account,<br />
            enter the following code:
          </p>
        </div>

        <div class="flex justify-center my-10">
          <div class="bg-[#0077B5] w-[120px] h-[40px] rounded">
            <p class="text-[22px] font-semibold text-white text-center pt-1">
              ${OTP}
            </p>
          </div>
        </div>

        <div>
          <p class="text-[18px] text-[#564E4E] mb-2">
            If you didn't request this code, you can ignore this mail!
          </p>
          <p class="text-[18px] text-[#564E4E]">
            This is an automatically generated email. Please note that this
            email address is not actively monitored, and any responses may not
            be received or reviewed promptly.
          </p>

          <div class="my-5">
            <p class="text-[16px] text-[#564E4E]">Have a question?</p>
            <p class="text-[16px] text-[#564E4E]">
              Check out our help center or contact us in the app using
            </p>

            <a href="https://wa.me/+8801756175141?text=Hii..." target="_blank">
            <p class="text-[#0077B5]"> Profile > Contact Us   </p>   
            </a>
          </div>
        </div>

<div class="my-7 px-24">
    <div class="bg-[#DBDBDB] h-[1px]"></div>

</div>

<div>

<div class="text-center">
    <p class="text-[14px] font-semibold">Bringin <a href="https://bringin.io/privacypolicy" target="_blank">
        <span class="text-[#0077B5]"> Privacy Policy   </span>   
        </a></p>
    <p class="text-[14px] font-semibold">Plot 25, Road 04, Sector 10, Uttara, Dhaka – 1230.</p>
</div>

<div class="flex justify-center gap-2 my-3">
    <a href="https://wa.me/+8801756175141?text=Hii..." target="_blank">
        <img alt="bringin image" className="w-[55px] h-[55px] w-[24px] " src='/image/09.whatsapp.svg'></img>
      </a>
    <a href="https://www.facebook.com/bringin.io" target="_blank">
        <img alt="bringin image" className="w-[55px] h-[55px]  "src='/image/Vector.svg'></img>
      </a>
    <a href="https://www.instagram.com/bringin.io/" target="_blank">
        <img alt="bringin image" className="w-[55px] h-[55px]  " src='/image/Group.svg' ></img>
      </a>
    <a href="https://www.linkedin.com/company/bringinapp" target="_blank">
        <img alt="bringin image" className="w-[55px] h-[55px]  "  src='/image/Group (1).svg'></img>
      </a>
    <a href="https://www.youtube.com/@Bringinapp" target="_blank">
        <img alt="bringin image" className="w-[55px] h-[55px]  "  src='/image/Group 28.svg'></img>
      </a>
    <a href="https://twitter.com/bringinapp" target="_blank">
        <img alt="bringin image" className="w-[55px] h-[55px]  " src='/image/Group (2).svg'></img>
      </a>
</div>

</div>


      </div>
    </section>
  </body>
</html> 
              `,
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

module.exports = app;
