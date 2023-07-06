const express = require("express");
const app = express();
const Recruiters = require("../../Model/Recruiter/recruiters");
const tokenverify = require("../../MiddleWare/tokenverify.js")
const jwt = require('jsonwebtoken');
const { Otp } = require("../../Model/otpModel");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")
const { CompanyVerify } = require("../../Model/Recruiter/Verify/company_verify.js")
const { ProfileVerify } = require("../../Model/Recruiter/Verify/profile_verify.js")
const transportar = nodemailer.createTransport({
    service: "gmail",
    auth: {
        "user": "bringin.sdk@gmail.com",
        "pass": "datjwskkwpqmybih"
    }
})




function getRandomInt(max) {
    return Math.floor(Math.random() * 9000 + 1000);
};



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
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;
                var verifydata = await CompanyVerify.findOne({ userid: _id })
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
                        size: req.file.size
                    }).save()
                    await Recruiters.findByIdAndUpdate({ _id: _id }, { $set: { company_docupload: true } })
                    res.status(200).send("file upload successfull")
                } else {
                    await CompanyVerify.findOneAndUpdate({ userid: _id }, {
                        $set: {
                            fieldname: req.file.fieldname,
                            originalname: req.file.originalname,
                            encoding: req.file.encoding,
                            mimetype: req.file.mimetype,
                            destination: req.file.destination,
                            filename: req.file.filename,
                            path: req.file.path,
                            size: req.file.size
                        }
                    })
                    await Recruiters.findByIdAndUpdate({ _id: _id }, { $set: { company_docupload: true } })
                    res.status(200).send("file reupload successfull")
                }

            }
        })

    } catch (error) {
        res.status(404).send(error);
    }
})




app.post("/profile_verify", tokenverify, upload.single("image"), async (req, res) => {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;
                if (req.body.type == 1) {
                    const OTP = getRandomInt(4);
                    const otp = await Otp({ number: authdata.number, otp: OTP, });
                    const salt = await bcrypt.genSalt(10);
                    otp.otp = await bcrypt.hash(otp.otp, salt);
                    await otp.save();
                    const mailoption = {
                        from: "bringin.sdk@gmail.com",
                        to: req.body.email,
                        subject: "Otp verify",
                        text: `Otp is ${OTP}`
                    }
                    transportar.sendMail(mailoption, async (err, info) => {
                        if (err) {
                            res.status(400).send(err)
                        } else {
                            await Recruiters.findByIdAndUpdate({ _id: _id }, { $set: { profile_docupload: true } })
                            res.status(200).send("verification code send successfull")
                        }
                    })


                } else if (req.body.type == 5) {
                    var verifydata = await ProfileVerify.findOne({ userid: _id })
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
                            size: 0, type: req.body.type,
                            link: req.body.link,
                        }).save()
                        await Recruiters.findByIdAndUpdate({ _id: _id }, { $set: { profile_docupload: true } })
                        res.status(200).send("send successfull")
                    } else {
                        await ProfileVerify.findOneAndUpdate({ userid: _id }, {
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
                            }
                        })
                        await Recruiters.findByIdAndUpdate({ _id: _id }, { $set: { profile_docupload: true } })
                        res.status(200).send("send successfull")
                    }
                } else {
                    var verifydata = await ProfileVerify.findOne({ userid: _id })
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
                            size: req.file.size, type: req.body.type,
                            link: "",
                        }).save()
                        await Recruiters.findByIdAndUpdate({ _id: _id }, { $set: { profile_docupload: true } })
                        res.status(200).send("send successfull")
                    } else {
                        await ProfileVerify.findOneAndUpdate({ userid: _id }, {
                            $set: {
                                fieldname: req.file.fieldname,
                                originalname: req.file.originalname,
                                encoding: req.file.encoding,
                                mimetype: req.file.mimetype,
                                destination: req.file.destination,
                                filename: req.file.filename,
                                path: req.file.path,
                                size: req.file.size, type: req.body.type,
                                link: "",
                            }
                        })
                        await Recruiters.findByIdAndUpdate({ _id: _id }, { $set: { profile_docupload: true } })
                        res.status(200).send("send successfull")
                    }
                }

            }
        })

    } catch (error) {
        res.status(404).send(error);
    }







})

app.post("/email_code_verify", tokenverify, (req, res)=> {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
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
                    await Recruiters.findByIdAndUpdate({ _id: _id }, { $set: { profile_verify: true } })
                    return res.status(200).json({
                      message: "verification Successfully!",
                    });
                  } else {
                    return res.status(400).send("Your OTP was wrong!");
                  }
            }
        })

    } catch (error) {
        res.status(404).send(error);
    }
})


module.exports = app;