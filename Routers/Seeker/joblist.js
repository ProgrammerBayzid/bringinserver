const express = require("express");
const app = express();
const tokenverify = require("../../MiddleWare/tokenverify.js")
const jwt = require('jsonwebtoken');
const { Company, Companysize } = require("../../Model/Recruiter/Company/company.js")
const JobPost = require('../../Model/Recruiter/Job_Post/job_post.js')
const multer = require("multer");
const Career_preferences = require("../../Model/career_preferences.js")
const JobSave = require("../../Model/jobsave.js")
const JobReport = require("../../Model/job_report.js");
const { EducationLavel } = require("../../Model/education_lavel.js");
const { Salirietype } = require("../../Model/salarie");
const Experince = require("../../Model/experience.js");
const { Expertisearea } = require('../../Model/industry')
const ViewJob = require('../../Model/viewjob')
const Seekeruser = require('../../Model/userModel.js')
const { Chat, Message } = require("../../Model/Chat/chat")
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



// job list

function salaryfilter(filter, careardata) {
    return careardata.filter((data) => {
        // console.log(filter.salary.max_salary.salary <= data.salaray.max_salary.salary)
        if (data.salaray.min_salary.type == 1  && data.salaray.max_salary.type == 1) {
            if(data.salaray.min_salary.salary <= filter.salary.min_salary.salary &&  filter.salary.max_salary.salary <= data.salaray.max_salary.salary){
                return true;
            }else{
                return false
            }
            
        } else {
            if(data.salaray.min_salary.type == filter.salary.min_salary.type &&  data.salaray.max_salary.type == filter.salary.max_salary.type){
                return true;
            }else{
                return false;
            }
            
        }
    })
}

function locationfilter(filter, careardata) {
    return careardata.filter((data) => {
        if ((new RegExp(data.division.cityid.name.toLowerCase())).test(filter.company.c_location.formet_address.toLowerCase()) == true) {
            return true;
        } else {
            return false;
        }
    })
}

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
                { path: "salaray.min_salary", select: "-other_salary" },
                { path: "salaray.max_salary", select: "-other_salary" },];
                var careardata = await Career_preferences.find({ userid: _id }).populate(creaarpopulate);

                let functionarea = [];
                let jobtype = [];
                for (let index = 0; index < careardata.length; index++) {
                    functionarea.push(careardata[index].functionalarea._id);
                    jobtype.push(careardata[index].jobtype._id)
                }
                var populate = [
                    { path: "userid" },
                    { path: "expertice_area"},
                    { path: "experience" },
                    { path: "education" , select: "-digree"},
                    { path: "company", populate: [{ path: "c_size" }, { path: "industry", select: "-category" }] },
                    { path: "salary.min_salary", select: "-other_salary" },
                    { path: "salary.max_salary", select: "-other_salary" },
                    { path: "skill" },
                    { path: "jobtype" , match: { _id: { $in: jobtype } } },
                ];
               // , match: { _id: { $in: jobtype } } 
                if (req.query.functionalarea == 0) {
                    var company = await JobPost.find({expertice_area: {$in: functionarea}}).populate(populate).then((data) => data.filter((filterdata) => {
                    //     var salary = salaryfilter(filterdata, careardata);
                    //     var location = locationfilter(filterdata, careardata)
                       
                    //    if (salary.length > 0 && location.length > 0 && filterdata.expertice_area != null && filterdata.jobtype != null &&  filterdata.userid.other.profile_verify == true) {
                    //         return true;
                    //     } else {
                    //         return false
                    //     }
                    return true;
                    }));
                    // .exec().then((data) => data.filter((filterdata) => filterdata.userid.other.profile_verify == true &&  filterdata.company != null && filterdata.expertice_area != null && filterdata.salary != null && filterdata.jobtype != null))

                    res.status(200).send(company)
                } else {
                    var company = await JobPost.find({ expertice_area: req.query.functionalarea }).populate(populate).then((data) => data.filter((filterdata) => {
                        var salary = salaryfilter(filterdata, careardata);
                        var location = locationfilter(filterdata, careardata)
                        if (salary.length > 0 && location.length > 0 && filterdata.userid.other.profile_verify == true) {
                            return true;
                        } else {
                            return false
                        }
                    
                    }))
                    res.status(200).send(company);
                }
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
})


app.get("/job_search", tokenverify, async (req, res) => {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;
                var term = new RegExp(req.query.city, 'i');
                var company = await JobPost.find({ job_title: { $regex: req.query.search, $options: "i" } }).populate(
                    [{path: "userid"},
                    "expertice_area",
                    "experience",
                    "education",
                    { path: "salary.min_salary", select: "-other_salary" },
                    { path: "salary.max_salary", select: "-other_salary" },
                    { path: "company", match:  { "c_location.formet_address": { $regex: term} }, populate: [{ path: "c_size" }, { path: "industry", select: "-category" }] },
                    "skill",
                    "jobtype"]).then((data) => data.filter((filterdata) => filterdata.userid.other.profile_verify== true &&  filterdata.company != null))
                res.status(200).send(company);
// req.query.city ??
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
})


app.post("/job_save", tokenverify, async (req, res) => {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;
                var jobdata = await JobPost.findOne({ _id: req.body.jobid })
                var data = await JobSave.findOne({ userid: _id, jobid: req.body.jobid })
                if (data == null) {
                    await JobSave({ userid: _id, jobid: req.body.jobid, jobpostuserid: jobdata._id }).save()
                    await Seekeruser.findOneAndUpdate({ _id: _id }, { $inc: { "other.savejob": 1 } })
                    res.status(200).json({ message: "job save successfull" })
                } else {
                    await JobSave.findOneAndDelete({ _id: data._id })
                    await Seekeruser.findOneAndUpdate({ _id: _id }, { $inc: { "other.savejob": -1 } })
                    res.status(200).json({ message: "job unsave successfull" })
                }
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
})

app.get("/job_save", tokenverify, async (req, res) => {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;

                var data = await JobSave.find({ userid: _id }).select("jobid").populate({
                    path: "jobid", populate: ["userid",
                        "expertice_area",
                        "experience",
                        "education",
                        { path: "salary.min_salary", select: "-other_salary" },
                        { path: "salary.max_salary", select: "-other_salary" },
                        { path: "company", populate: [{ path: "c_size" }, { path: "industry", select: "-category" }] },
                        "skill",
                        "jobtype"]
                })
                if (data == null) {
                    res.status(400).json({ message: "Save Job Not Found" })
                } else {
                    res.status(200).send(data)
                }
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
})



app.post("/job_report", tokenverify, upload.single("image"), async (req, res) => {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;
                var reportdata = await JobReport.findOne({ userid: _id, jobid: req.body.jobid })
                if (reportdata == null) {
                    await JobReport({ userid: _id, jobid: req.body.jobid, report: req.body.report, image: req.file == null ? "" : req.file.path, description: req.body.description }).save()
                    res.status(200).json({ message: "report successfull" })
                } else {
                    await JobReport.findOneAndUpdate({ userid: _id, jobid: req.body.jobid }, {
                        $set: {
                            report: req.body.report, image: req.file == null ? "" : req.file.path, description: req.body.description
                        }
                    })
                    res.status(200).json({ message: "you job report update" })
                }
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }


})



app.get("/job_filter", tokenverify, async (req, res) => {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;

                let alleducation = [];
                var education = await EducationLavel.find().select("name");
                education.forEach((e) => {
                    alleducation.push(e._id)
                })
                let allsalary = [];
                var salaray = await Salirietype.find({},{other_salary: {$slice: 1}}).populate([{path: "other_salary", select: "-other_salary"}])
                salaray.forEach((e) => allsalary.push({min_salary: e._id, max_salary: e.other_salary.length > 0 ? e.other_salary[0]._id : e._id}))
                let allexperience = [];
                var experience = await Experince.find()
                experience.forEach((e) => { allexperience.push(e._id) })
                let allindustry = [];
                var industry = await Expertisearea.find().select("industryname")
                industry.forEach((e) => allindustry.push(e._id))
                let allcompanysize = [];
                var companysize = await Companysize.find()
                companysize.forEach((e) => allcompanysize.push(e._id))
                let requreeducation = {
                    allworkplace: [true, false],
                    workplace: [
                        {
                            name: "Remote",
                            value: true
                        },
                        {
                            name: "On-Site",
                            value: false
                        }
                    ],
                    alleducation: alleducation,
                    education: education,
                    allsalary: allsalary,
                    salary: salaray,
                    allexperience: allexperience,
                    experience: experience,
                    allindustry: allindustry,
                    industry: industry,
                    allcompanysize: allcompanysize,
                    companysize: companysize,


                }
                res.status(200).json(requreeducation)

            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
})


app.post('/job_filter', tokenverify, async (req, res) => {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;

                var workplace = req.body.workplace
                var education = req.body.education
                var salary = req.body.salary
                var experience = req.body.experience
                var industry = req.body.industry
                var companysize = req.body.companysize

                var minsalary = [];
                var maxsalary = [];
                for (let index = 0; index < req.body.salary.length; index++) {
                    minsalary.push(req.body.salary[index].min_salary)
                    maxsalary.push(req.body.salary[index].max_salary)
                }
               

                var populate = [
                    { path: "userid" },
                    { path: "expertice_area", match: { industryid: { $in: industry } } },
                    { path: "experience", match: { _id: { $in: experience } } },
                    { path: "education", match: { _id: { $in: education } } },
                    { path: "company", populate: [{ path: "c_size", match: { _id: { $in: companysize } } }, { path: "industry", select: "-category" }] },
                    { path: "salary.min_salary", select: "-other_salary", match: {_id: {$in: minsalary}}},
                    { path: "salary.max_salary", select: "-other_salary" , match: {_id: {$in: maxsalary}}},
                    { path: "skill" },
                    { path: "jobtype" }

                ]
                var joblist = await JobPost.find({ expertice_area: req.body.functionalareaid, remote: { $in: workplace } }).populate(populate).then((data) => data.filter((filterdata) =>  filterdata.expertice_area != null && filterdata.experience != null && filterdata.education != null && filterdata.company.c_size != null && filterdata.salary.min_salary != null && filterdata.salary.max_salary != null))

                res.status(200).json(joblist)

            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
})



app.post("/view_job_count", tokenverify, async (req, res) => {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;

                var viewjobdata = await ViewJob.findOne({ jobid: req.body.jobid, userid: _id })
                if (viewjobdata == null) {
                    await ViewJob({ jobid: req.body.jobid, userid: _id, jobpost_userid: req.body.jobpost_userid }).save();
                    await Seekeruser.findOneAndUpdate({ _id: _id }, { $inc: { "other.viewjob": 1 } })
                }
                res.status(200).json({ message: "successfull view" })
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
})





module.exports = app;