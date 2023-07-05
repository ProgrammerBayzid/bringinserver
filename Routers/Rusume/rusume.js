const express = require("express");
const app = express();
const multer = require("multer");

const { Resume } = require("../../Model/resumefile");

const tokenverify = require("../../MiddleWare/tokenverify.js");
const jwt = require("jsonwebtoken");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "resumes");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname);
  },
});
const resume = multer({ storage: storage ,limits: { fileSize: 2000000 }});

app.post("/resume", tokenverify, resume.single("resume"), async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        if (req.file && req.file.size < 1048576) {
          const resumedata = await Resume({
            resume: req.file,
            userid: _id,
            uploadtime: new Date()
          });
          const resumefile = await resumedata.save();
          res.status(200).json({message: "upload successfull"});
        }else{
          res.status(400).json({message: "upload maximum 1mb file"});
        }
        
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/resume", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const resumeData = await Resume.find({ userid: _id });
        res.send(resumeData);
      }
    });
  } catch (error) {
    res.send(error);
  }
});

app.delete("/resume", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const user = authdata._id;
        const deleteData = await Resume.findOneAndDelete({_id: req.query.id, userid: user});
        res.status(200).json({message: "delete successfull"});
      }
    });
  } catch (error) {
    res.send(error);
  }
});

module.exports = app;
