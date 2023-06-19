const express = require("express");
const app = express();


const {
    JobSearchingStatus
} = require("../../Model/jobSearchingStatus");

const tokenverify = require("../../MiddleWare/tokenverify.js");
const jwt = require("jsonwebtoken");



app.post("/jobSearchingStatus", tokenverify, async (req, res) => {
    try {
      jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
        if (err) {
          res.json({ message: "invalid token" });
        } else {
          const _id = authdata._id;
          const data = await JobSearchingStatus({
            jobhuntingstatus: req.body.jobhuntingstatus,
            morestatus: req.body.morestatus,
            lookingforanyjob: req.body.lookingforanyjob,
            userid: _id,
          });
          const protfolio = await data.save();
          res.status(200).send(protfolio);
        }
      });
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  app.get("/jobSearchingStatus/:_id", tokenverify, async (req, res) => {
    try {
      jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
        if (err) {
          res.json({ message: "invalid token" });
        } else {
          const _id = authdata._id;
          const data = await JobSearchingStatus.find({ userid: _id });
          res.send(data);
        }
      });
    } catch (error) {
      res.send(error);
    }
  });
  
  




module.exports = app;
