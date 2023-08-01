const express = require("express");
const app = express();
const tokenverify = require("../../MiddleWare/tokenverify.js")
const jwt = require('jsonwebtoken');
const multer = require("multer");
const EducationLavel = require('../../Model/education_lavel.js')
const Skill = require('../../Model/Recruiter/Skill/skill.js')
const JobPost = require('../../Model/Recruiter/Job_Post/job_post.js')
const RecruiterFunctionarea = require("../../Model/Recruiter/Recruiter_Functionarea/recruiter_functionarea.js")
const {Functionarea} = require("../../Model/industry.js")
const {notificaton_send_by_job} = require("../../Routers/Notification/notification")
const Recruiters = require("../../Model/Recruiter/recruiters");
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



app.post("/skill", tokenverify, async (req, res) => {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                var id = authdata._id;
                var skilldata = await Skill.findOne({ skill: req.body.skill })

                if (skilldata == null) {
                    await Skill({ skill: req.body.skill, userid: id }).save();
                    res.status(200).json({ message: "skill add successfull" })
                } else {
                    res.status(200).json({ message: "skill allready added" })
                }

            }
        })

    } catch (error) {
        res.send(error);
    }
})


app.get("/skill", tokenverify, async (req, res) => {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                var id = authdata._id;
                var skilldata = await Skill.find({ userid: id })
                var data = await Skill.find().select("-userid");

                res.status(200).json({ userskill: skilldata, defaultskill: data })



            }
        })

    } catch (error) {
        res.send(error);
    }
})





app.get("/job_title", tokenverify, async (req, res) => {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
        if (err) {
            res.json({ message: "invalid token" })
        } else {
            var id = authdata._id;
            var data2 = await Functionarea.find({functionalname: {"$regex": req.query.search, "$options": "i"}}).populate([{path: "industryid", select: "-category"},{path: "categoryid", select: "-functionarea"}])
            res.status(200).send(data2)
        }
    })

})


app.post('/job_post', tokenverify, async (req, res) => {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                var id = authdata._id;
                var jobpost = await JobPost.findOne({ userid: id, job_title: req.body.job_title, expertice_area: req.body.expertice_area })

                if (jobpost == null) {
                    var jobdata = await JobPost({
                        userid: id,
                        job_title: req.body.job_title,
                        expertice_area: req.body.expertice_area,
                        job_description: req.body.job_description,
                        experience: req.body.experience,
                        education: req.body.education,
                        salary: req.body.salary,
                        company: req.body.company,
                        skill: req.body.skill,
                        jobtype: req.body.jobtype,
                        remote: req.body.remote,
                        job_location: req.body.job_location,
                        job_status_type: 1,
                        job_status: "Open",
                        postdate: new Date()
                    });
                    jobdata.save();
                    var functiondata = await RecruiterFunctionarea.findOne({ userid: id, expertice_area: req.body.expertice_area });
                    if (functiondata == null) {
                        await RecruiterFunctionarea({ userid: id, expertice_area: req.body.expertice_area, jobid: jobdata._id }).save()
                    }
                  
                    Promise.all([
                        notificaton_send_by_job(req.body.expertice_area, id, {"type": 2, "jobid": jobdata._id})
                    ])
                    await Recruiters.findOneAndUpdate({ _id: id }, {
                        $set: {"other.latestjobid": jobdata._id}});
                    res.status(200).json({ jobid: jobdata._id })
                } else {
                    res.status(400).json({ message: "Job Post Allready Submited" })
                }
            }
        })

    } catch (error) {
        res.send(error);
    }
})


app.get('/job_post', tokenverify, async (req, res) => {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                var id = authdata._id;

                var populate = ["userid",
                    "expertice_area",
                    "experience",
                    "education",
                    { path: "salary.min_salary", select: "-other_salary" },
                    { path: "salary.max_salary", select: "-other_salary" },
                    { path: "company", populate: [{ path: "c_size" }, { path: "industry", select: "-category" }] },
                    "skill",
                    "jobtype"];

                if (req.query.type == 0) {
                    var jobpost = await JobPost.find({ userid: id }).populate(populate)
                    res.status(200).send(jobpost)
                } else {
                    var jobpost = await JobPost.find({ userid: id, job_status_type: req.query.type }).populate(populate)
                    res.status(200).send(jobpost)
                }


            }
        })

    } catch (error) {
        res.send(error);
    }
})


app.post('/job_post_update', tokenverify, async (req, res) => {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {

                var id = authdata._id;
                if (req.query.jobid) {
                    await JobPost.findOneAndUpdate({ _id: req.query.jobid }, {
                        $set: {
                            userid: id,
                            job_title: req.body.job_title,
                            expertice_area: req.body.expertice_area,
                            job_description: req.body.job_description,
                            experience: req.body.experience,
                            education: req.body.education,
                            salary: req.body.salary,
                            company: req.body.company,
                            skill: req.body.skill,
                            jobtype: req.body.jobtype,
                            remote: req.body.remote,
                            job_location: req.body.job_location,
                            job_status_type: req.body.job_status_type ?? 1,
                            job_status: req.body.job_status_type == 2 ? "Close" : "Open",
                            postdate: new Date()
                        }
                    })
                    await RecruiterFunctionarea.findOneAndUpdate({ userid: id, jobid: req.query.jobid }, { $set: { expertice_area: req.body.expertice_area } })

                    res.status(200).json({ message: "Update Successfull" })
                }
            }
        })

    } catch (error) {
        res.send(error);
    }
})

app.delete('/job_post_update', tokenverify, async (req, res) => {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {

                var id = authdata._id;
                if (req.query.jobid) {
                    await JobPost.findOneAndDelete({ _id: req.query.jobid, userid: id })
                    await RecruiterFunctionarea.deleteMany({ userid: id, jobid: req.query.jobid })
                    res.status(200).json({ message: "Delete Successfull" })
                }
            }
        })

    } catch (error) {
        res.send(error);
    }
})


app.get('/single_jobdetails', tokenverify, async (req, res) => {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                const _id = authdata._id;
                var populate = ["userid",
                "expertice_area",
                "experience",
                "education",
                { path: "salary.min_salary", select: "-other_salary" },
                { path: "salary.max_salary", select: "-other_salary" },
                { path: "company", populate: [{ path: "c_size" }, { path: "industry", select: "-category" }] },
                "skill",
                "jobtype"];
                var company = await JobPost.findOne({ _id: req.query.jobid }).populate(populate)
                res.status(200).send(company);
            }
        })
    } catch (error) {
        res.status(400).send(error);
    }
})


const maskEmail = (email = '') => {
    const [name, domain] = email.split('@');
    const { length: len } = name;
    const maskedName = name[0] + '...' + name[len - 1];
    const maskedEmail = maskedName + '@' + domain;
    return maskedEmail;
 };

app.post("/email", async (req, res)=> {
   
    var data = maskEmail(req.body.string)
        
    res.status(200).send(data )
    


})

module.exports = app;




// 0 = pending
// 1 = open
// 2 = close
// 3 = reject
