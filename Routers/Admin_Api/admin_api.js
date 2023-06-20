const express = require("express");
const app = express();
const tokenverify = require("../../MiddleWare/tokenverify.js")
const jwt = require('jsonwebtoken');
const multer = require("multer");
const { EducationLavel,Digree,Subject} = require("../../Model/education_lavel.js")
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


app.get('/education_lavel', async (req, res) => {
    try {
        var data = await EducationLavel.find().populate([{path: "digree",select: "-subject"}]);
                res.status(200).send(data)

    } catch (error) {
        res.send(error);
    }
})






app.post('/digree_add', async (req, res)=> {
    try {
     var data = await Digree.findOne({name: req.body.name})
     if (data == null) {
        var digreedata = await Digree({name: req.body.name, education: req.body.education});
        digreedata.save();
        await EducationLavel.findOneAndUpdate({_id: req.body.education}, {$push: {digree:digreedata._id }})
        res.status(200).json({message: "add successfull"})
     }else{
         res.status(200).json({message: "all ready added"})
     }
    } catch (error) {
     res.status(400).send(error)
    }
 })


 app.post('/subject_add', async (req, res)=> {
    try {
     var data = await Subject.findOne({name: req.body.name})
     if (data == null) {
        var subjectdata = await Subject(req.body);
        subjectdata.save();
        await Digree.findOneAndUpdate({_id: req.body.digree}, {$push: {subject:subjectdata._id }})
        res.status(200).json({message: "add successfull"})
     }else{
         res.status(200).json({message: "all ready added"})
     }
    } catch (error) {
     res.status(400).send(error)
    }
 })



 app.get('/subject', async (req, res)=> {
    try {
     var data = await Subject.find({name: {"$regex": req.query.name,"$options": "i"}})
     res.status(200).send(data)
    } catch (error) {
     res.status(400).send(error)
    }
 })














module.exports = app;