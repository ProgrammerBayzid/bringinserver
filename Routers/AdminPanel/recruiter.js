const express = require("express");
const app = express();
const Company = require("../../Model/Recruiter/Company/company")
const Skill = require("../../Model/Recruiter/Skill/skill")
const Candidatereport = require("../../Model/Recruiter/Candidate_Report/candidate_report")




app.delete("/recruiter_delete", async (req, res)=>{
    await Company.findOneAndDelete({userid: req.query.id});
    await Skill.findOneAndDelete({userid: req.query.id});
    await Candidatereport.findOneAndDelete({userid: req.query.id});


})







module.exports = app;