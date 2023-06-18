const express = require("express");
const app = express();
const Recruiters = require("../../Model/Recruiter/recruiters");
const tokenverify = require("../../MiddleWare/tokenverify.js")
const jwt = require('jsonwebtoken');
const { Company, Companysize } = require("../../Model/Recruiter/Company/company.js")

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



app.post("/companySize_add", async (req, res) => {
    var companysize = await Companysize.findOne({
        size: req.body.size,
    });
    if (companysize == null) {
        await Companysize({ size: req.body.size }).save();
        res.json({ message: "company size add successfull" });
    } else {
        res.json({ message: "company size already added" });
    }
})



app.post('/company', tokenverify, (req, res) => {

    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;

                

                await Company.findOneAndUpdate({ userid: _id }, {
                    $set: {
                        userid: _id,
                        legal_name: req.body.legal_name,
                        sort_name: req.body.sort_name,
                        industry: req.body.industry,
                        c_size: req.body.c_size,
                        c_location: req.body.c_location,
                        c_website: req.body.c_website
                    }
                })

                res.status(200).send("Company Registation Successfull")
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }

})




















module.exports = app;