const express = require("express");
const app = express();
const Recruiters = require("../../Model/recruiters");
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

app.get("/recruiters", tokenverify, async (req, res) => {

    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;
                const singalRecruiter = await Recruiters.findById(_id);
                res.send(singalRecruiter);
            }
        })
    } catch (error) {
        res.send(error);
    }
});



//   // # update user data  

app.patch("/recruiters", tokenverify, upload.single("image"), async (req, res) => {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;
                if (req.file) {
                    await Recruiters.findByIdAndUpdate(_id, {
                       $set: {image: req.file.path}
                   });
               }
                const updateRecruiter = await Recruiters.findByIdAndUpdate(_id, {
                    $set: {
                        fastname: req.body.fastname,
                        lastname: req.body.lastname,
                        companyname:req.body.companyname,
                        designation:req.body.designation,
                        email: req.body.email,
                    }
                }, {
                    new: true,
                });
                
                res.send(updateRecruiter);

            }
        })

    } catch (error) {
        res.status(404).send(error);
    }
});









module.exports = app;