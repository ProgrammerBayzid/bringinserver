const express = require("express");
const app = express();
const User = require("../../Model/userModel");
const tokenverify = require("../../MiddleWare/tokenverify.js");
const jwt = require("jsonwebtoken");
const Experince = require("../../Model/experience.js");
const multer = require("multer");
const Recruiters = require("../../Model/Recruiter/recruiters");
const ViewJob = require('../../Model/viewjob')
const { Chat } = require("../../Model/Chat/chat")
const JobSave = require("../../Model/jobsave.js")
const { Resume } = require("../../Model/resumefile");
const Career_preferences = require("../../Model/career_preferences.js");
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

// user get


async function profilenmberupdate(_id) {
  var viewjob = await ViewJob.find({ userid: _id })
  var jobsave = await JobSave.find({ userid: _id })
  var resume = await Resume.find({ userid: _id })
  var chat = await Chat.find({ seekerid: _id, type: 1 })
  var carearpre = await Career_preferences.find({ userid: _id })
  await User.findByIdAndUpdate({ _id: _id }, {
    $set: {
      "other.viewjob": viewjob.length,
      "other.cvsend": resume.length,
      "other.totalchat": chat.length,
      "other.savejob": jobsave.length,
      "other.carearpre": carearpre.length

    }
  })



}

app.get("/users", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const singalUser = await User.findById(_id).populate("experiencedlevel");
        Promise.all([profilenmberupdate(_id)])
        res.send(singalUser);
      }
    });
  } catch (error) {
    res.send(error);
  }
});

//   // # update user data

app.post("/users", tokenverify, upload.single("image"), async (req, res) => {

  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;

        if (req.file) {
          await User.findByIdAndUpdate(_id, {
            $set: { image: req.file.path },
          });
        }
        const updateUser = await User.findByIdAndUpdate(
          _id,
          {
            $set: {
              fastname: req.body.fastname,
              lastname: req.body.lastname,
              gender: req.body.gender,
              experiencedlevel: req.body.experiencedlevel,
              startedworking: req.body.startedworking,
              deatofbirth: req.body.deatofbirth,
              email: req.body.email,
              secoundnumber: req.body.number,
            },
          },
          {
            new: true,
          }
        );

        res.status(200).json({ message: "Successfully Updated" });
      }
    });
  } catch (error) {
    res.status(404).send(error);
  }
});



// experience get

app.get("/experiencelist", tokenverify, (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: err });
      } else {
        var experidata = await Experince.find();
        res.json(experidata);
      }
    });
  } catch (error) {
    res.send(error);
  }
});


app.post("/notification", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        if (req.body.isrecruiter == true) {
          await Recruiters.findOneAndUpdate({ _id: _id }, {
            $set: {
              "other.notification.push_notification": req.body.push,
              "other.notification.whatsapp_notification": req.body.whatsapp,
              "other.notification.sms_notification": req.body.sms,
              "other.notification.job_recommandation": req.body.job,
            }
          })
          res.status(200).json({ message: "update successfull" });
        } else {
          const singalUser = await User.findOneAndUpdate({ _id: _id }, {
            $set: {
              "other.notification.push_notification": req.body.push,
              "other.notification.whatsapp_notification": req.body.whatsapp,
              "other.notification.sms_notification": req.body.sms,
              "other.notification.job_recommandation": req.body.job,
            }
          });
          res.status(200).json({ message: "Successfully Updated" });
        }

      }
    });
  } catch (error) {
    res.send(error);
  }
})


app.post("/job_hunting", tokenverify, (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const singalUser = await User.findOneAndUpdate({ _id: _id }, {
          $set: {
            "other.job_hunting": req.body.job_hunting,
            "other.more_status": req.body.more_status,
            "other.job_right_now": req.body.job_right_now
          }
        });
        res.status(200).json({ message: "Successfully Updated" });
      }
    });
  } catch (error) {
    res.send(error);
  }
})


app.post("/push_notification", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        if (req.body.isrecruiter == true) {
          await Recruiters.findOneAndUpdate({ _id: _id }, {
            $set: {
              "other.pushnotification": req.body.pushnotification,
            }
          })
          res.status(200).json({ message: "Successfully Updated" });
        } else {
          const singalUser = await User.findOneAndUpdate({ _id: _id }, {
            $set: {
              "other.pushnotification": req.body.pushnotification,
            }
          });
          res.status(200).json({ message: "update successfull" });
        }
      }
    });
  } catch (error) {
    res.send(error);
  }
})



module.exports = app;
