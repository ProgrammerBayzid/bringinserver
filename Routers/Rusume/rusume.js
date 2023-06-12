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

app.post("/resume", resume.single("resume"), async (req, res) => {
  try {
    const resumedata = new Resume(req.file.path);
    const resumefile = await resumedata.save();
    res.status(201).send(resumefile);
  } catch (error) {
    res.status(400).send(error);
  }
});



app.get('/resume', async (req, res) =>{
    try {
        const resumeData = await Resume.find();
        res.send(resumeData);
      } catch (error) {
        res.send(error);
      }
})

app.get('/resume/:id', async (req, res) =>{
    try {
        const id = req.params.id;
        const resumeData = await Resume.findById(id);
        res.send(resumeData);
      } catch (error) {
        res.send(error);
      }
})



module.exports = app;
