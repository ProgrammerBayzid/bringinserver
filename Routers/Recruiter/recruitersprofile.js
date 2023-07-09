const express = require("express");
const app = express();
const Recruiters = require("../../Model/Recruiter/recruiters");
const tokenverify = require("../../MiddleWare/tokenverify.js")
const jwt = require('jsonwebtoken');

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



// recruiters get

app.get("/recruiters_profile", tokenverify, async (req, res) => {

    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {

            if (err) {
                res.json({ message: "invalid token" })
            } else {
                
                const _id = authdata._id;
                const singalRecruiter = await Recruiters.findOne({ _id: _id }).populate({
                    path: 'companyname',
                    populate: {
                        path: 'industry',
                        model: 'industries' ,
                        select: "industryname"
                    }
                });
                res.status(200).send(singalRecruiter);
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
});



//   // # update user data  

app.post("/recruiters_update", tokenverify, upload.single("image"), async (req, res) => {

    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;
                if (req.file) {
                    console.log(req.file.path)
                    await Recruiters.findOneAndUpdate({ _id: _id }, {
                        $set: { image: req.file.path ,"other.incomplete": 0, "other.complete": 6}
                    });
                  
                }
                const updateRecruiter = await Recruiters.findOneAndUpdate({ _id: _id }, {
                    $set: {
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        designation: req.body.designation,
                        email: req.body.email,
                    }
                }, {
                    new: true,
                });

                res.status(200).json({message: "profile update successfull"});

            }
        })

    } catch (error) {
        res.status(404).send(error);
    }
});



module.exports = app;