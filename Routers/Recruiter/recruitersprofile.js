const express = require("express");
const app = express();
const Recruiters = require("../../Model/Recruiter/recruiters");
const tokenverify = require("../../MiddleWare/tokenverify.js");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const candidatesave = require("../../Model/Recruiter/Candidate_Save/candidate_save");
const { Chat } = require("../../Model/Chat/chat");
const ViewJob = require("../../Model/viewjob");
const JobPost = require("../../Model/Recruiter/Job_Post/job_post.js");
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

async function recruiternumberupdate(_id) {
  var candidate = await candidatesave.find({ userid: _id });
  var chat = await Chat.find({
    recruiterid: _id,
    type: 1,
    recruitermsgdate: { $ne: null },
  });
  var viewjob = await ViewJob.find({ jobpost_userid: _id });
  var totaljob = await JobPost.find({ userid: _id });
  await Recruiters.findOneAndUpdate(
    { _id: _id },
    {
      $set: {
        "other.total_chat": chat.length,
        "other.savecandidate": candidate.length,
        "other.totaljob": totaljob.length,
        "other.latestjobid":
          totaljob.length > 0 ? totaljob[totaljob.length - 1]._id : null,
      },
    }
  );
  // console.log(viewjob.length)
  // await Chat.findOneAndUpdate({recruiterid: _id, type: 3},{$set: {"who_view_me.totalview": viewjob.length}})
}

app.get("/recruiters_profile", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const singalRecruiter = await Recruiters.findOne({ _id: _id }).populate(
          [
            {
              path: "companyname",
              populate: {
                path: "industry",
                model: "industries",
                select: "industryname",
              },
            },
            { path: "other.package", populate: { path: "packageid" } },
          ]
        );
        Promise.all([recruiternumberupdate(_id)]);
        res.status(200).send(singalRecruiter);
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

//   // # update user data

app.post(
  "/recruiters_update",
  tokenverify,
  upload.single("image"),
  async (req, res) => {
    try {
      jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
        if (err) {
          res.json({ message: "invalid token" });
        } else {
          const _id = authdata._id;
          if (req.file) {
            console.log(req.file.path);
            await Recruiters.findOneAndUpdate(
              { _id: _id },
              {
                $set: {
                  image: req.file.path,
                  "other.incomplete": 0,
                  "other.complete": 6,
                },
              }
            );
          }
          const updateRecruiter = await Recruiters.findOneAndUpdate(
            { _id: _id },
            {
              $set: {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                designation: req.body.designation,
                email: req.body.email,
              },
            },
            {
              new: true,
            }
          );

          res.status(200).json({ message: "Photo updated successfully" });
        }
      });
    } catch (error) {
      res.status(404).send(error);
    }
  }
);

app.get("/clint_recruiters_profile/:_id", async (req, res) => {
  try {
    const _id = req.params._id;
    const singalRecruiter = await Recruiters.findById(_id).populate([
      {
        path: "companyname",
        populate: [
          {
            path: "industry",
            populate: "industryid",
            // select: "industryname",
          },
          "c_size",
        ],
      },
      { path: "other.package", populate: { path: "packageid" } },
      {
        path: "other",
        populate: {
          path: "latestjobid",
          populate: [
            "jobtype",
            "experience",
            "education",
            "salary.min_salary",
            "salary.max_salary",
          ],
        },
      },
    ]);
    Promise.all([recruiternumberupdate(_id)]);
    res.status(200).send(singalRecruiter);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = app;
