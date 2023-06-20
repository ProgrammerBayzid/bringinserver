const express = require("express");
const app = express();
const tokenverify = require("../../MiddleWare/tokenverify.js")
const jwt = require('jsonwebtoken');
const multer = require("multer");
const EducationLavel = require("../../Model/education_lavel.js")
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

// education lavel 

app.post('/education_lavel', async (req, res)=> {
   try {
    var data = await EducationLavel.findOne(req.body)
    if (data == null) {
       await EducationLavel(req.body).save(); 
       res.status(200).json({message: "add successfull"})
    }else{
        res.status(200).json({message: "all ready added"})
    }
   } catch (error) {
    res.status(400).send(error)
   }
})

















module.exports = app;