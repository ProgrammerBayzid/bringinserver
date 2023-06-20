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



app.get("/companySize", tokenverify, (req, res)=> {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;
               var companysize = await Companysize.find()
               res.status(200).send(companysize);
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
})



app.post('/company', tokenverify, (req, res) => {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;
                var company = await Company.findOne({ userid: _id })
                if (company != null) {
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
                    console.log(company._id)
                    await Recruiters.findOneAndUpdate({_id: _id}, {$set: {companyname: company._id}})
                    res.status(200).send("company registation update Successfull")
                } else {
                   var data = await Company({
                        userid: _id,
                        legal_name: req.body.legal_name,
                        sort_name: req.body.sort_name,
                        industry: req.body.industry,
                        c_size: req.body.c_size,
                        c_location: req.body.c_location,
                        c_website: req.body.c_website

                    })
                    data.save();
                    console.log(data._id)
                    await Recruiters.findOneAndUpdate({_id: _id}, {$set: {companyname: data._id}})
                    res.status(200).send("company registation Add Successfull")
                }
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
})




app.get('/company', tokenverify, (req, res) => {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;

                var company = await Company.findOne({ userid: _id }).populate(["industry", "c_size"])
                if (company == null) {
                    res.status(200).send(Company({
                        userid: _id,
                        legal_name: null,
                        sort_name: null,
                        industry: null,
                        c_size: null,
                        c_location: {
                            lat: 0,
                            lon: 0,
                            formet_address: "",
                            city: "",
                        },
                        c_website: null,
                    }))
                } else {
                    res.status(200).send(company)
                }

            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
})



app.post("/company_search",tokenverify, (req , res)=> {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;
                var company = await Company.find({legal_name: {"$regex": req.body.search,"$options": "i"} }).populate(["industry", "c_size"])
                res.status(200).send(company);
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
})





module.exports = app;