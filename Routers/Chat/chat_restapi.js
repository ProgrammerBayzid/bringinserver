const express = require("express");
const app = express();
const User = require("../../Model/userModel");
const Recruiters = require("../../Model/Recruiter/recruiters");
const tokenverify = require("../../MiddleWare/tokenverify.js");
const jwt = require("jsonwebtoken");
const Experince = require("../../Model/experience.js");
const { Chat, Message, Chatreport, CandidateReject , ChatFeedBack} = require("../../Model/Chat/chat")
const { Profiledata } = require("../../Model/Seeker_profile_all_details")
const multer = require("multer");
const candidateview = require("../../Model/Recruiter/Candidate_View/candidate_view")
const candidatesave = require("../../Model/Recruiter/Candidate_Save/candidate_save")
const ViewJob = require("../../Model/viewjob")
const savejob = require("../../Model/jobsave")

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




app.post("/bringin_sup_gen", async (req, res)=> {
  var channel = await Chat({type: 2,  bring_assis: {
            title: "Bringin Assistant",
            message1: "Hi, Jakaria! welcome to brinign!",
            message2: "You are now approve to reach more.",
            bringlastmessage: null
  }})
  await channel.save();
  var message = {
        "createdAt": new Date().getTime(),
        "text": `Welcome to Bringin! you are now approved to reach more! if there anything we can help you with, feel free to reach us at +88 01756175141 via WhatsApp.`,
  }
  var msg = await Message({channel: channel._id, message: message})
  await msg.save();
  console.log(msg._id)
  console.log(channel._id)
  await Chat.findOneAndUpdate({_id: channel._id}, {$set: {"bring_assis.bringlastmessage": msg._id}})
  res.status(200).send("bringin assistent create successfull")

})

app.get("/bringin_sup_msg",async (req, res)=> {

  var msg = await Message.find({channel: req.query.channelid})
  res.status(200).send(msg)

})

app.get("/whoviewme_reset", tokenverify, async (req, res)=> {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        if(req.query.isrecruiter == "false") {
          await Chat.findOneAndUpdate({seekerid: _id, "who_view_me.title": "Who viewed me"}, {$set : { "who_view_me.newview": 0}})
          res.status(200).json({message: "date update"})
        }else{
          await Chat.findOneAndUpdate({recruiterid: _id, "who_view_me.title": "Who viewed me"}, {$set : { "who_view_me.newview": 0}})
          res.status(200).json({message: "date update"})
        }
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
  
})


app.get("/channellist", tokenverify, async (req, res) => {
  var data;
  var populate = [
    { path: "expertice_area" },
    { path: "experience" },
    { path: "education", select: "-digree" },
    { path: "company", populate: [{ path: "c_size" }, { path: "industry", select: "-category" }] },
    { path: "salary.min_salary", select: "-other_salary" },
    { path: "salary.max_salary", select: "-other_salary" },
    { path: "skill" },
    { path: "jobtype" },
  ];
  var populate2 = [
    { path: "userid", populate: { path: "experiencedlevel" } },
    {
      path: "workexperience", options: {
        limit: 1
      }, populate: [{ path: "category", select: "-functionarea" }, "expertisearea"]
    },
    {
      path: "education", options: {
        limit: 1
      }, populate: [{ path: "digree", select: "-subject", populate: { path: "education", select: "-digree" } }, "subject"]
    },
    "skill",
    "protfoliolink",
    "about",
    {
      path: "careerPreference", options: {
        limit: 1
      }, populate: [{ path: "category", select: "-functionarea" }, { path: "functionalarea", populate: [{ path: "industryid", select: "-category" }] }, { path: "division", populate: { path: "cityid", select: "-divisionid" }, }, "jobtype", { path: "salaray.min_salary", select: "-other_salary" }, { path: "salaray.max_salary", select: "-other_salary" },],
    },
  ];

  if (req.query.seeker == "false") {
    data = await Chat.find({ seekerid: req.query.userid, $or: [{seekerid: req.query.userid},{recruiterid: null}] }).sort({ updatedAt: -1 })
      .populate([
        { path: "jobid", populate: populate, select: "-userid" },
        { path: "candidate_fullprofile", populate: populate2 },
        { path: "seekerid", select: ["other.online", "other.pushnotification", "other.lastfunctionalarea", "other.offlinedate", "fastname", "number", "secoundnumber", "fastname", "lastname", "image", "email"], populate: { path: "other.lastfunctionalarea" } },
        { path: "recruiterid", select: ["number", "firstname", "lastname", "companyname", "designation", "image", "other.online", "other.pushnotification", "other.premium", "email", "other.offlinedate"], populate: { path: "companyname", populate: { path: "industry" } } },
        { path: "lastmessage" },
        {path: "bring_assis.bringlastmessage"},
        {path: "who_view_me.seekerviewid"},
        {path: "who_view_me.recruiterview"}
      ])
  } else {
    data = await Chat.find({ recruiterid: req.query.userid, $or: [{recruiterid: req.query.userid},{seekerid: null}] }).sort({ updatedAt: -1 }).populate([
      { path: "jobid", populate: populate, select: "-userid" },
      { path: "candidate_fullprofile", populate: populate2 },
      { path: "seekerid", select: ["other.online", "other.pushnotification", "other.lastfunctionalarea", "other.offlinedate", "fastname", "number", "secoundnumber", "fastname", "lastname", "image", "email"], populate: { path: "other.lastfunctionalarea" } },
      { path: "recruiterid", select: ["number", "firstname", "lastname", "companyname", "designation", "image", "other.online", "other.pushnotification", "other.premium", "email", "other.offlinedate"], populate: { path: "companyname", populate: { path: "industry" } } },
      { path: "lastmessage" },{path: "bring_assis.bringlastmessage"},{path: "who_view_me.seekerviewid",options: {

      }},
      {path: "who_view_me.recruiterview", select: ["fastname", "lastname"]}

    ])
      
  }
  res.status(200).send(data)

})



app.post('/message_update', tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        await Message.findOneAndDelete({ _id: req.body.messageid }, {
          message: { customProperties: { $set: { request: 1 } } }
        })
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
})


app.post('/chat_report', tokenverify, upload.single("image"), async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        await Chatreport({
          userid: _id,
          channel: req.body.channel,
          seekerid: req.body.seekerid,
          report: req.body.report,
          recruiterid: req.body.recruiterid,
          image: req.file == null ? "" : req.file.path,
          discription: req.body.discription
        }).save()
        res.status(200).json({ message: "report successfull" })
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
})



app.post("/candidate_reject", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        var rejectdata = await CandidateReject.findOne({ userid: _id, candidateid: req.body.candidateid })
        if (rejectdata == null) {
          var data = await Profiledata.findOne({ userid: req.body.candidateid })
          await CandidateReject({ userid: _id, candidateid: req.body.candidateid, candidatefullprofileid: data._id }).save()
          var rejectchat = await Chat.findOneAndUpdate({recruiterid: _id, type: 4}, {$inc: {"not_interest.person": 1}})
          if(rejectchat == null){
            await Chat({recruiterid: _id, type: 4, not_interest :{person: 1, title: "Not Interested"} }).save()
          }
           await Chat.findOneAndUpdate({recruiterid: _id, seekerid: req.body.candidateid, type: 1}, {$set: {"recruiter_reject": true}})
        
          res.status(200).json({ message: "Reject successfull" })
        } else {
          res.status(200).json({ message: "All ready Reject" })
        }

      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
})


app.post("/candidate_unreject", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        var rejectdata = await CandidateReject.findOneAndDelete({ userid: _id, candidateid: req.body.candidateid })
        if (rejectdata == null) {
          res.status(400).json({ message: "Candidate Not Found" })
        } else {
          await Chat.findOneAndUpdate({recruiterid: _id, type: 4}, {$inc: {"not_interest.person": -1}})
          await Chat.findOneAndUpdate({recruiterid: _id, seekerid: req.body.candidateid, type: 1}, {$set: {"recruiter_reject": false}})
          res.status(200).json({ message: "Candidate Unrejected Successfull" })
        }

      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
})


app.get("/candidate_reject", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        var rejectdata = await CandidateReject.find({ userid: _id }).populate([{
          path: "candidatefullprofileid", populate: [
            { path: "workexperience", populate: [{ path: "category", select: "-functionarea" }, "expertisearea"] },
            { path: "education", populate: [{ path: "digree", select: "-subject", populate: { path: "education", select: "-digree" } }, "subject"] },
            "skill",
            "protfoliolink",
            "about",
            {
              path: "careerPreference", populate: [{ path: "category", select: "-functionarea" }, "functionalarea", { path: "division", populate: { path: "cityid", select: "-divisionid" } }, "jobtype",
              { path: "salaray.min_salary", select: "-other_salary" },
              { path: "salaray.max_salary", select: "-other_salary" },]
            },
            { path: "userid", populate: { path: "experiencedlevel" } }
          ]
        }])
        res.status(200).send(rejectdata)
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
})




app.get('/recruiter_msg_date', tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        await Chat.findOneAndUpdate({ _id: req.query.channelid }, { $set: { recruitermsgdate: new Date() } })

        res.status(200).send("date update")

      }
    });
  } catch (error) {
    res.status(400).send(error);
  }

})



app.get('/datetime', (req, res) => {
  var date_time = new Date()
  res.status(200).json(date_time.getTime())
})



app.post("/channelcreate", tokenverify, async (req, res) => {

  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        var populate = [
          { path: "expertice_area" },
          { path: "experience" },
          { path: "education", select: "-digree" },
          { path: "company", populate: [{ path: "c_size" }, { path: "industry", select: "-category" }] },
          { path: "salary.min_salary", select: "-other_salary" },
          { path: "salary.max_salary", select: "-other_salary" },
          { path: "skill" },
          { path: "jobtype" },
        ];
        var populate2 = [
          { path: "userid", populate: { path: "experiencedlevel" } },
          {
            path: "workexperience", options: {
              limit: 1
            }, populate: [{ path: "category", select: "-functionarea" }, "expertisearea"]
          },
          {
            path: "education", options: {
              limit: 1
            }, populate: [{ path: "digree", select: "-subject", populate: { path: "education", select: "-digree" } }, "subject"]
          },
          "skill",
          "protfoliolink",
          "about",
          {
            path: "careerPreference", options: {
              limit: 1
            }, populate: [{ path: "category", select: "-functionarea" }, { path: "functionalarea", populate: [{ path: "industryid", select: "-category" }] }, { path: "division", populate: { path: "cityid", select: "-divisionid" }, }, "jobtype", { path: "salaray.min_salary", select: "-other_salary" }, { path: "salaray.max_salary", select: "-other_salary" },],
          },
        ];

        var data = await Chat.findOne({ seekerid: req.body.seekerid, recruiterid: req.body.recruiterid }).populate([
          { path: "jobid", populate: populate, select: "-userid" },
          { path: "candidate_fullprofile", populate: populate2 },

          { path: "seekerid", select: ["other.online", "other.pushnotification", "other.lastfunctionalarea", "other.offlinedate", "fastname", "number", "secoundnumber", "fastname", "lastname", "image", "email"], 
          populate: { path: "other.lastfunctionalarea" } }, 
          { path: "recruiterid", select: ["number", "firstname", "lastname", "companyname", "designation", "image", "other.online", "other.pushnotification", "other.premium", "email", "other.offlinedate"], populate: { path: "companyname", populate: { path: "industry" } } }, { path: "lastmessage" }])
        if (data == null) {
          var channeldata = await Chat({ seekerid: req.body.seekerid, recruiterid: req.body.recruiterid, date: new Date(), jobid: req.body.jobid, candidate_fullprofile: req.body.candidate_fullprofile });
          await channeldata.save();
          var channelinfo = await Chat.findOne({ _id: channeldata._id }).populate([
            { path: "jobid", populate: populate, select: "-userid" },
            { path: "candidate_fullprofile", populate: populate2 },
            { path: "seekerid", select: ["other.online", "other.pushnotification", "other.lastfunctionalarea", "other.offlinedate", "fastname", "number", "secoundnumber", "fastname", "lastname", "image", "email"],
             populate: { path: "other.lastfunctionalarea" } }, 
             { path: "recruiterid", select: ["number", "firstname", "lastname", "companyname", "designation", "image", "other.online", "other.pushnotification", "other.premium", "email","other.offlinedate"], populate: { path: "companyname", populate: { path: "industry" } } }, { path: "lastmessage" }])
          await Recruiters.findOneAndUpdate({ _id: req.body.recruiterid }, { $inc: { "other.total_chat": 1 } })
          await User.findOneAndUpdate({ _id: req.body.seekerid }, { $inc: { "other.totalchat": 1 } })
          res.status(200).send(channelinfo)
        } else {
          res.status(200).send(data)
        }
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }




})


app.get("/cv_send_count", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        await User.findOneAndUpdate({ _id: _id }, { $inc: { "other.cvsend": 1 } })


      }
    });
  } catch (error) {
    res.status(400).send(error);
  }

})



app.get("/single_channelinfo", tokenverify, async (req, res) => {
  var data = await Chat.findOne({ _id: req.query.channelid }).populate([{ path: "seekerid" }, { path: "recruiterid", populate: { path: "companyname", populate: { path: "industry" } } }, { path: "lastmessage" }])
  res.status(200).send(data)
})



app.get('/who_view_me', tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" })
      } else {
        const _id = authdata._id;

        if (req.query.isrecruiter == "false") {
          let recruiterjob = [];
          var populate = [
            { path: "userid" },
            { path: "expertice_area" },
            { path: "experience" },
            { path: "education", select: "-digree" },
            { path: "company", populate: [{ path: "c_size" }, { path: "industry", select: "-category" }] },
            { path: "salary.min_salary", select: "-other_salary" },
            { path: "salary.max_salary", select: "-other_salary" },
            { path: "skill" },
            { path: "jobtype" },
          ];
          const job = await candidateview.find({ candidate_id: _id }).populate({ path: "userid", populate: { path: "other.latestjobid", populate: populate } })
          for (let index = 0; index < job.length; index++) {
            recruiterjob.push(job[index].userid.other.latestjobid)
          }
          res.status(200).send(recruiterjob)
        } else {
          let candidate = [];
          var populate = [
            {
              path: "workexperience",
              populate: [
                { path: "category", select: "-functionarea" },
                "expertisearea",
              ],
            },
            {
              path: "education",
              populate: [
                {
                  path: "digree",
                  select: "-subject",
                  populate: { path: "education", select: "-digree" },
                },
                "subject",
              ],
            },
            "skill",
            "protfoliolink",
            "about",
            {
              path: "careerPreference",
              populate: [
                { path: "category", select: "-functionarea" },
                {
                  path: "functionalarea",
                  populate: [{ path: "industryid", select: "-category" }],
                },
                {
                  path: "division",
                  populate: { path: "cityid", select: "-divisionid" },
                },
                "jobtype",
                { path: "salaray.min_salary", select: "-other_salary" },
                { path: "salaray.max_salary", select: "-other_salary" },
              ],
            },
            { path: "userid", populate: { path: "experiencedlevel" } },
          ];
          var viewjob = await ViewJob.find({ jobpost_userid: _id }).populate({ path: "userid", populate: { path: "other.full_profile", populate: populate } })
          for (let index = 0; index < viewjob.length; index++) {
            candidate.push(viewjob[index].userid.other.full_profile)
          }

          res.status(200).send(candidate)
        }
      }
    })
  } catch (error) {
    res.status(400).send(error);
  }
})


app.get('/who_save_me', tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" })
      } else {
        const _id = authdata._id;

        if (req.query.isrecruiter == "false") {
          let recruiterjob = [];
          var populate = [
            { path: "userid" },
            { path: "expertice_area" },
            { path: "experience" },
            { path: "education", select: "-digree" },
            { path: "company", populate: [{ path: "c_size" }, { path: "industry", select: "-category" }] },
            { path: "salary.min_salary", select: "-other_salary" },
            { path: "salary.max_salary", select: "-other_salary" },
            { path: "skill" },
            { path: "jobtype" },
          ];
          const job = await candidatesave.find({ candidateid: _id }).populate({ path: "userid", populate: { path: "other.latestjobid", populate: populate } })
          for (let index = 0; index < job.length; index++) {
            recruiterjob.push(job[index].userid.other.latestjobid)
          }
          res.status(200).send(recruiterjob)

        } else {
          let candidate = [];
          var populate = [
            {
              path: "workexperience",
              populate: [
                { path: "category", select: "-functionarea" },
                "expertisearea",
              ],
            },
            {
              path: "education",
              populate: [
                {
                  path: "digree",
                  select: "-subject",
                  populate: { path: "education", select: "-digree" },
                },
                "subject",
              ],
            },
            "skill",
            "protfoliolink",
            "about",
            {
              path: "careerPreference",
              populate: [
                { path: "category", select: "-functionarea" },
                {
                  path: "functionalarea",
                  populate: [{ path: "industryid", select: "-category" }],
                },
                {
                  path: "division",
                  populate: { path: "cityid", select: "-divisionid" },
                },
                "jobtype",
                { path: "salaray.min_salary", select: "-other_salary" },
                { path: "salaray.max_salary", select: "-other_salary" },
              ],
            },
            { path: "userid", populate: { path: "experiencedlevel" } },
          ];
          const candidatedata = await savejob.find({ jobpostuserid: _id }).populate({ path: "userid", populate: { path: "other.full_profile", populate: populate } })

          for (let index = 0; index < candidatedata.length; index++) {
            candidate.push(candidatedata[index].userid.other.full_profile)
          }
          res.status(200).send(candidate)

        }
      }
    })
  } catch (error) {
    res.status(400).send(error);
  }
})



app.post("/chatfeedback", upload.single("image"), tokenverify, async (req, res)=> {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" })
      } else {
        const _id = authdata._id;
        await ChatFeedBack({userid: req.body.userid,
          recruiterid: req.body.recruiterid == null ? null : req.body.recruiterid,
          text: req.body.text,
          image:  req.file != null ?  req.file.path : null,
          channel: req.body.channel,}).save()
          res.status(200).json({message: "Feedback submit successfully"})
      }
    })
  } catch (error) {
    res.status(400).send(error);
  }
})


// recruiter




module.exports = app