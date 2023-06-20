const express = require("express");
const app = express();
const Recruiters = require("../../Model/Recruiter/recruiters");
const tokenverify = require("../../MiddleWare/tokenverify.js")
const jwt = require('jsonwebtoken');
const { Company, Companysize } = require("../../Model/Recruiter/Company/company.js")
const JobPost = require('../../Model/Recruiter/Job_Post/job_post.js')
const multer = require("multer");
const Career_preferences = require("../../Model/career_preferences.js")
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





app.get("/seeker_expertise", tokenverify, async (req, res)=> {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;
                var carear = await Career_preferences.find({userid: _id}).populate(["functionalarea"]).select("functionalarea")
                // var company = await JobPost.find({legal_name: {"$regex": req.body.search,"$options": "i"} }).populate(["industry", "c_size"])
                res.status(200).send(carear);
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
})



app.get("/seeker_joblist", tokenverify, async (req, res)=> {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;
                // var carear = await Career_preferences.find({userid: _id}).populate(["functionalarea"]).select("functionalarea")
                var company = await JobPost.find({expertice_area: req.query.functionalarea }).populate(["userid",
                "expertice_area",
                "experience",
                "education",
                "salary",
                {path: "company",populate: [{path: "c_size"},{path: "industry", select: "-category"}]},
                "skill",
                "jobtype"])
                res.status(200).send(company);
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
})








module.exports = app;