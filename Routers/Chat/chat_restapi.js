const express = require("express");
const app = express();
const User = require("../../Model/userModel");
const tokenverify = require("../../MiddleWare/tokenverify.js");
const jwt = require("jsonwebtoken");
const Experince = require("../../Model/experience.js");
const { Chat, Message } = require("../../Model/Chat/chat")
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







module.exports = app