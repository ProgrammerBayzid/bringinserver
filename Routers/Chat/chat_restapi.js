const express = require("express");
const app = express();
const User = require("../../Model/userModel");
const Recruiters = require("../../Model/Recruiter/recruiters");
const tokenverify = require("../../MiddleWare/tokenverify.js");
const jwt = require("jsonwebtoken");
const Experince = require("../../Model/experience.js");
const { Chat, Message , Chatreport, CandidateReject} = require("../../Model/Chat/chat")
const {Profiledata} = require("../../Model/Seeker_profile_all_details")
const multer = require("multer");

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




app.get("/channellist", tokenverify, async (req, res)=> {
    var data;
    if(req.query.seeker == "false"){
        data = await Chat.find({ seekerid: req.query.userid }).sort({updatedAt: -1}).populate([{ path: "seekerid" }, { path: "recruiterid" , populate: {path: "companyname",  populate: {path: "industry"}}}, {path: "lastmessage"}])
    }else{
        data = await Chat.find({ recruiterid: req.query.userid }).sort({updatedAt: -1}).populate([{ path: "seekerid" }, { path: "recruiterid" , populate: {path: "companyname",  populate: {path: "industry"}}}, {path: "lastmessage"}])
    }
  
   res.status(200).send(data)

})



app.post('/message_update',tokenverify, async (req, res)=>{
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
          if (err) {
            res.json({ message: "invalid token" });
          } else {
            const _id = authdata._id;
            await Message.findOneAndDelete({_id: req.body.messageid}, { 
                message: {customProperties: {$set: {request: 1} }}
            })
          }
        });
      } catch (error) {
        res.status(400).send(error);
      }
})


app.post('/chat_report',tokenverify, upload.single("image") ,async (req, res)=>{
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        await Chatreport({
          userid: _id,
          channel: req.body.channel,
          seekerid : req.body.seekerid,
          report: req.body.report,
          recruiterid: req.body.recruiterid,
          image: req.file == null ? "" : req.file.path,
          discription: req.body.discription}).save()
          res.status(200).json({message: "report successfull"})
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
} )



app.post("/candidate_reject", tokenverify ,async (req, res)=>{
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
          var rejectdata = await CandidateReject.findOne({userid: _id,candidateid: req.body.candidateid})
          if (rejectdata == null) {
            var data = await Profiledata.findOne({userid: req.body.candidateid})
            await CandidateReject({userid: _id,candidateid: req.body.candidateid, candidatefullprofileid: data._id}).save()
            res.status(200).json({message: "Reject successfull"})
          }else{
            res.status(200).json({message: "All ready Reject"})
          }
          
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
})


app.get("/candidate_reject", tokenverify ,async (req, res)=>{
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
          var rejectdata = await CandidateReject.find({userid: _id}).populate([{ path:"candidatefullprofileid", populate: [
            {path: "workexperience",populate:[{path: "category", select: "-functionarea"},"expertisearea"] },
            {path: "education",populate: [{path: "digree",select: "-subject", populate: {path: "education", select: "-digree"}},"subject"]},
            "skill",
            "protfoliolink",
            "about",
            {path: "careerPreference",populate: [{path: "category",select: "-functionarea"},"functionalarea",{ path: "division", populate: { path: "cityid", select: "-divisionid" } },"jobtype","salaray"]},
            {path:"userid", populate: {path: "experiencedlevel"}}
          ]}])
          res.status(200).send(rejectdata)
         
          
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
})




app.get('/recruiter_msg_date', tokenverify ,async (req, res)=>{
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
       await Chat.findOneAndUpdate({_id: req.query.channelid}, {$set: {recruitermsgdate: new Date()}})
        
       res.status(200).send("date update")
      
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
  
})



app.get('/datetime', (req, res)=>{
  var date_time = new Date()
   res.status(200).send(date_time)
})



app.post("/channelcreate", tokenverify ,async (req, res)=>{

  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        var data = await Chat.findOne({ seekerid: req.body.seekerid, recruiterid: req.body.recruiterid }).populate([{ path: "seekerid" }, { path: "recruiterid" , populate: {path: "companyname",  populate: {path: "industry"}}}, {path: "lastmessage"}])
        if (data == null) {
            var channeldata = await Chat({ seekerid: req.body.seekerid, recruiterid: req.body.recruiterid, date: new Date() });
            await channeldata.save();
            var channelinfo = await Chat.findOne({ _id: channeldata._id }).populate([{ path: "seekerid" }, { path: "recruiterid" , populate: {path: "companyname",  populate: {path: "industry"}}}, {path: "lastmessage"}])
            if(_id == req.body.recruiterid) {
              await Recruiters.findOneAndUpdate({_id: _id}, {$inc: {total_chat: 1}})
            }else{
              await User.findOneAndUpdate({_id: _id}, {$inc: { totalchat: 1} })
            }
            
            res.status(200).send(channelinfo)
        } else {
          res.status(200).send(data)
        }
      
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }




})


module.exports = app