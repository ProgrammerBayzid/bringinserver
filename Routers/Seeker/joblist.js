const express = require("express");
const app = express();
const Recruiters = require("../../Model/Recruiter/recruiters");
const tokenverify = require("../../MiddleWare/tokenverify.js")
const jwt = require('jsonwebtoken');
const { Company, Companysize } = require("../../Model/Recruiter/Company/company.js")
const JobPost = require('../../Model/Recruiter/Job_Post/job_post.js')
const multer = require("multer");
const Career_preferences = require("../../Model/career_preferences.js")
const JobSave = require("../../Model/jobsave.js")
const jobreport = require("../../Model/job_report.js");
const JobReport = require("../../Model/job_report.js");
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





app.get("/seeker_expertise", tokenverify, async (req, res) => {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;
                var carear = await Career_preferences.find({ userid: _id }).populate(["functionalarea"]).select("functionalarea")
                // var company = await JobPost.find({legal_name: {"$regex": req.body.search,"$options": "i"} }).populate(["industry", "c_size"])
                res.status(200).send(carear);
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
})



app.get("/seeker_joblist", tokenverify, async (req, res) => {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;

                var creaarpopulate = [{ path: "category", select: "-functionarea" },
                        "functionalarea",
                    { path: "division", populate: { path: "cityid", select: "-divisionid" } },
                        "jobtype",
                        "salaray"];
                    var careardata = await Career_preferences.find({ userid: _id }).populate(creaarpopulate);
                    
                    let functionarea = [];
                    let cityname = [];
                    let minsalary = []
                    let maxsalary = []
                    let jobtype = [];
                    let functionalregex;
                    let cityregex;
                    let minregex;
                    let maxregex;
                    let jobtyperegex;

                    for (let index = 0; index < careardata.length; index++) {
                        functionarea.push(careardata[index].functionalarea.functionalname);
                        cityname.push(careardata[index].division.divisionname);
                        minsalary.push(careardata[index].salaray.min_salary);
                        maxsalary.push(careardata[index].salaray.max_salary)
                        jobtype.push(careardata[index].jobtype.worktype)

                        
                    }
                    functionalregex = functionarea.join("|");
                    cityregex = cityname.join("|");
                    minregex = minsalary.join("|");
                    maxregex = maxsalary.join("|");
                    jobtyperegex = jobtype.join("|");
                if (req.query.functionalarea == 0) {
                    var company = await JobPost.find().populate([
                    {path: "userid"},
                    {path: "expertice_area", match: { "functionalname": { $regex: functionalregex, $options: "i" } }},
                    {path: "experience"},
                    {path: "education"},
                    {path: "company",match: { "c_location.formet_address": { $regex: cityregex, $options: "i" } },populate: [{ path: "c_size" }, { path: "industry", select: "-category" }]},
                    {path: "salary" ,match: { "min_salary": { $regex: minregex, $options: "i" }, "max_salary": { $regex: maxregex, $options: "i" }  }},
                    {path: "skill"},
                    {path: "jobtype",match: { "worktype": { $regex: jobtyperegex, $options: "i" } }},
                ]).exec().then((data) => data.filter((filterdata) => filterdata.company != null && filterdata.expertice_area != null && filterdata.salary != null && filterdata.jobtype != null))
                    res.status(200).send(company)
                } else {
                    var company = await JobPost.find({ expertice_area: req.query.functionalarea }).populate(["userid",
                        "expertice_area",
                        "experience",
                        "education",
                        "salary",
                        { path: "company",match: { "c_location.formet_address": { $regex: cityregex, $options: "i" } }, populate: [{ path: "c_size" }, { path: "industry", select: "-category" }] },
                        "skill",
                        "jobtype"])
                    res.status(200).send(company);
                }
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
})


app.get("/job_search",  tokenverify, async (req, res)=> {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;
                var company = await JobPost.find({job_title: {$regex: req.query.search, $options: "i"} }).populate(["userid",
                        "expertice_area",
                        "experience",
                        "education",
                        "salary",
                        { path: "company",match: { "c_location.formet_address": { $regex: req.query.city ?? "", $options: "i" } }, populate: [{ path: "c_size" }, { path: "industry", select: "-category" }] },
                        "skill",
                        "jobtype"]).then((data) => data.filter((filterdata) => filterdata.company != null))
                    res.status(200).send(company);
                
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
})


app.post("/job_save", tokenverify, async (req, res)=> {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;
                var jobdata = await JobPost.findOne({_id: req.body.jobid})
                var data = await JobSave.findOne({userid: _id, jobid: req.body.jobid})
                if (data == null) {
                    await JobSave({userid: _id, jobid: req.body.jobid, jobpostuserid: jobdata._id}).save()
                    res.status(200).json({message: "job save successfull"})
                }else{
                   await JobSave.findOneAndDelete({_id: data._id})
                   res.status(200).json({message: "job unsave successfull"}) 
                }   
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
})

app.get("/job_save", tokenverify, async (req, res)=>{
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;
               
                var data = await JobSave.find({userid: _id}).select("jobid").populate({path: "jobid", populate: ["userid",
                "expertice_area",
                "experience",
                "education",
                "salary",
                { path: "company", populate: [{ path: "c_size" }, { path: "industry", select: "-category" }] },
                "skill",
                "jobtype"]})
                if (data == null) {
                    res.status(400).json({message: "Save Job Not Found"})
                }else{
                   res.status(200).send(data)
                }   
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
})



app.post("/job_report", tokenverify, upload.single("image"), async (req, res)=> {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;
                var reportdata = await JobReport.findOne({userid: _id, jobid: req.body.jobid})
                if(reportdata == null){
                    await JobReport({userid: _id, jobid: req.body.jobid, report: req.body.report, image: req.file == null ? "" : req.file.path}).save()
                    res.status(200).json({message: "report successfull"})
                }else{
                    await JobReport.findOneAndUpdate({userid: _id, jobid: req.body.jobid},{$set: {
                        report: req.body.report, image: req.file == null ? "" : req.file.path
                    }})
                    res.status(200).json({message: "you job report update"})
                } 
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }


})



module.exports = app;