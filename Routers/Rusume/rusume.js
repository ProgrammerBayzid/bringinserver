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
const resume = multer({ storage: storage });

app.post("/resume", tokenverify, resume.single("resume"), async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const resumedata = await Resume({
          resume: req.file.path,
          userid: _id,
        });
        const resumefile = await resumedata.save();
        res.status(200).send(resumefile);
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/resume/:_id", tokenverify, async (req, res) => {
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

app.delete("/resume/:_id", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const user = authdata._id;
        const _id = { userid: user };
        const deleteData = await Resume.findOneAndDelete(_id);
        if (!_id) {
          return res.status(400).send();
        }
        res.send(deleteData);
      }
    });
  } catch (error) {
    res.send(error);
  }
});

module.exports = app;
