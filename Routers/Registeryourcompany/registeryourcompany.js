const express = require("express");
const app = express();

const { Registeryourcompany } = require("../../Model/registeryourcompany");

const tokenverify = require("../../MiddleWare/tokenverify.js");
const jwt = require("jsonwebtoken");

app.post("/registeryourcompany", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const data = await Registeryourcompany({
          companyname: req.body.companyname,
          industryname: req.body.industryname,
          companysize: req.body.companysize,
          companylocation: req.body.companylocation,
          companywebsite: req.body.companywebsite,
          userid: _id,
        });
        const companydata = await data.save();
        res.status(200).send(companydata);

      }
    });
  } catch (error) {}
});


app.get('/registeryourcompany/:_id', tokenverify, async (req,res)=>{
    try {
      jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
        if (err) {
            res.json({ message: "invalid token" })
        } else {
            const _id = authdata._id;
            const singleregisteryourcompanycedata = await Registeryourcompany.findOne({userid:_id});
            res.send(singleregisteryourcompanycedata);
        }
    })
       
      } catch (error) {
        res.send(error);
      }
});


app.patch('/registeryourcompany/:_id', tokenverify, async (req,res)=>{
    try {

      jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
        if (err) {
          res.json({ message: "invalid token" });
        } else {
          const user = authdata._id;
          const _id = { userid: user };
          const updateregisteryourcompany = await Registeryourcompany.findOneAndUpdate(
            _id,
            {
              $set: {
                  companyname: req.body.companyname,
                  industryname: req.body.industryname,
                  companysize: req.body.companysize,
                  companylocation: req.body.companylocation,
                  companywebsite: req.body.companywebsite,
              },
            },
            {
              new: true,
            }
          );
      
          res.send(updateregisteryourcompany);
        }
      });    
     
      } catch (error) {
        res.status(404).send(error);
      }
});

app.delete("/registeryourcompany/:_id",tokenverify, async (req, res) => {
    try {
      jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
        if (err) {
          res.json({ message: "invalid token" });
        } else {
          const user = authdata._id;
          const _id = { userid: user };
          const deleteData = await Registeryourcompany.findOneAndDelete(_id);
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
