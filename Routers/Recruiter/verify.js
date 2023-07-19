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



let htmltext = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Modern HTML Email Template</title>
<style type="text/css">
	body {
		margin: 0;
		background-color: #cccccc;
	}
	table {
		border-spacing: 0;
	}
	td {
		padding: 0;
	}
	img {
		border: 0;
	}

</style>
</head>
<body>



<!-- TOP BORDER -->


<!-- LOGO SECTION -->


<!-- BANNER IMAGE -->


<!-- THREE COLUMN SECTION -->


<!-- TWO COLUMN SECTION -->


<!-- TITLE, TEXT & BUTTON -->


<!-- FOOTER SECTION -->



</body>
</html>

<div style="position:absolute;bottom: 0;width: 100%;text-align: center;line-height: 40px;font-size: 25px;">
	<a href="https://responsivehtmlemail.com/html-email-course/" target="_blank" style="color: #404577;text-decoration: none;">www.ResponsiveHTMLEmail.com</a>
</div>





<!-- Begin Social Share **you can remove this to center the template :) -->
<style>
	.btn:hover {
		color: white;
		opacity: .8;
		transform: scale(1.02);
	}
</style>
<!-- Button trigger modal -->
<button type="button" class="btn btn-sm btn-danger" style="position: absolute; right: 7px; bottom: 7px;transition: transform .3s ease;" data-toggle="modal" data-target="#socialModal">
  Subscribe!
</button>
<!-- Modal -->
<div class="modal fade" id="socialModal" style="font-family: 'Poppins', sans-serif;">
  <div class="modal-dialog modal-md" role="document">
    <div class="modal-content" style="background-color: rgba(255, 255, 255, .9)!important;border: 0;">
      <div class="modal-header" style="display: none;">
        <button type="button" class="close" data-dismiss="modal">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
			<div class="modal-body">
				<div class="container-fluid text-center">
					<div class="row justify-content-center px-0">
						<div class="col-12">
							<h2 class="pt-2 pb-4">Subscribe & turn on notifications! <i class="fas fa-bell"></i></h2>
						</div>
						<div class="col-lg-5 my-2">
							<!-- YOUTUBE CHANNEL -->
							<a class="btn btn-lg" href="https://www.youtube.com/channel/UCZWoe3ezD_dZTZgQnDyBgFQ/?sub_confirmation=1" target="_blank" style="background-color: red;color: white;transition: transform .3s ease;"><i class="fab fa-youtube"></i> Subscribe
							</a>
						</div>
						<div class="col-12">
							<h6 class="pt-4 pb-0"><a href="https://responsivehtmlemail.com/html-email-course/" target="_blank">www.responsivehtmlemail.com</a></h6>
						</div>
					</div>
				</div>
			</div>
    </div>
  </div>
</div>
<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
<link href="https://fonts.googleapis.com/css?family=Poppins:100,200,300,400&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.0/js/all.min.js"></script>
<script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.7/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>
<script>
	$(this).delay(2000).queue(function() { /-- CHANGE DELAY TIME --/
		$("#socialModal").modal('show');
	});
</script>`;

module.exports = app;
