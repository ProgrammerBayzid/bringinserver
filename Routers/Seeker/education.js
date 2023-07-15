const express = require("express");
const app = express();
const tokenverify = require("../../MiddleWare/tokenverify.js")
const jwt = require('jsonwebtoken');
const {
    EducationLavel,
    Digree,
    Subject,
  } = require("../../Model/education_lavel.js");





app.get("/subject",tokenverify, async (req, res) => {
      try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                
                var data = await Digree.findOne({_id: req.query.digreeid}).populate({path: "subject", select: "-digree"})
                res.status(200).send(data.subject);
            }
        })
        
      } catch (error) {
        res.status(400).send(error);
      }
    });




module.exports = app