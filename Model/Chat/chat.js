const { Schema, model, } = require("mongoose");

const chatSchema  =  Schema(
    {
        seekerid:{
            type: "ObjectId",
            ref: "User"
        },
        recruiterid: {
            type: "ObjectId",
            ref: "Recruiters_profile"
        },
        date: Date,
        lastmessage: {
            type: "ObjectId",
            ref: "messagelist"
        },
        recruitermsgdate: {
            type: Date,
            default: null
        },
        currentdate: {
            type: Date
        },
        seekerblock: {
            type: Boolean,
            default: false
        },
        recruiterblock: {
            type: Boolean,
            default: false
        }
    },{timestamps: true},
   
);


const messageSchema  =  Schema(
    {
        channel : {
            type: "ObjectId",
            ref : "Chat_channel"
        },
        message: {

        }
    },{timestamps: true},
   
);

const chatreportSchema  =  Schema(
    {
        userid: "ObjectId",
        channel : {
            type: "ObjectId",
            ref : "Chat_channel"
        },
        seekerid: {
            type: "ObjectId",
            ref: "User"
        },
        recruiterid: {
            type: "ObjectId",
            ref: "Recruiters_profile"
        },
        image: [{
            type: String
        }],
        discription: String,
        report: [{
            type: String
        }]

        
    },{timestamps: true},
   
);

const candidaterejectSchema  =  Schema(
    {
        userid: "ObjectId",
        candidateid : {
            type: "ObjectId",
            ref : "User"
        },
        candidatefullprofileid: {
            type: "ObjectId",
            ref: "seeker_profiledata"
        },


        
    },{timestamps: true},
   
);



var Chat  = model("Chat_channel", chatSchema)
var Message = model("messagelist", messageSchema)
var Chatreport = model("chat_report", chatreportSchema)
var CandidateReject = model("candidate_reject", candidaterejectSchema)

module.exports = {Chat,Message, Chatreport, CandidateReject}
