const express = require("express");
const app = express();
const Recruiters = require("../../Model/Recruiter/recruiters");
const candidatesave = require("../../Model/Recruiter/Candidate_Save/candidate_save");
const { Chat, Message, Chatreport, CandidateReject, ChatFeedBack } = require("../../Model/Chat/chat")
const ViewJob = require("../../Model/viewjob")
const JobPost = require('../../Model/Recruiter/Job_Post/job_post.js')
const CandidateReport = require('../../Model/Recruiter/Candidate_Report/candidate_report')
const CandidateView = require("../../Model/Recruiter/Candidate_View/candidate_view");
const ChatStore = require("../../Model/Chat/chat_store");
const {CompanyVerify} = require("../../Model/Recruiter/Verify/company_verify.js");
const {Company} = require('../../Model/Recruiter/Company/company')
const CvSnedStore = require("../../Model/cv_send_store")
const JobReport = require('../../Model/job_report')
const JobSave = require('../../Model/jobsave')
const Packagebuy = require('../../Model/Package/package_buy.js')
const {ProfileVerify} = require('../../Model/Recruiter/Verify/profile_verify')
const Recruiterfunction = require('../../Model/Recruiter/Recruiter_Functionarea/recruiter_functionarea')
const {HelpFeedback} = require('../../Model/Help&Feedback')
const {Resume} = require('../../Model/resumefile')
const {Workexperience,Education,DefaultSkill,Skill,Protfoliolink,About,CareerPreference,Profiledata,} = require('../../Model/Seeker_profile_all_details')
const User = require('../../Model/userModel')

app.delete('/recruiter_delete', async (req, res) => {
    await CandidateReject.deleteMany({ userid: req.query.id })
    await CandidateReport.deleteMany({ userid: req.query.id })
    await candidatesave.deleteMany({ userid: req.query.id })
    await CandidateView.deleteMany({ userid: req.query.id })
    await Chat.deleteMany({ recruiterid: req.query.id})
    await Chatreport.deleteMany({ recruiterid: req.query.id})
    await ChatStore.deleteMany({ recruiterid: req.query.id})
    await ChatFeedBack.deleteMany({ recruiterid: req.query.id})
    await CompanyVerify.deleteMany({userid: req.query.id})
    await Company.deleteMany({userid: req.query.id})
    await CvSnedStore.deleteMany({recruiterid: req.query.id})
    await JobPost.deleteMany({userid: req.query.id})
    await JobReport.deleteMany({jobpostuserid: req.query.id})
    await JobSave.deleteMany({jobpostuserid: req.query.id})
    await Packagebuy.deleteMany({recruiterid: req.query.id})
    await ProfileVerify.deleteMany({userid: req.query.id})
    await Recruiterfunction.deleteMany({userid: req.query.id})
    await Recruiters.deleteMany({_id: req.query.id})
    await ViewJob.deleteMany({jobpost_userid: req.query.id})
   res.status(200).json({message: "all data remove this recruiter"})

})


app.delete('/seeker_delete', async (req, res) =>{
  await About.deleteMany({userid: req.params.id})
  await CandidateReject.deleteMany({ candidateid: req.query.id })
  await CandidateReport.deleteMany({ candidateid: req.query.id })
  await candidatesave.deleteMany({ candidateid: req.query.id})
  await CandidateView.deleteMany({ candidate_id: req.query.id })
  await CareerPreference.deleteMany({userid: req.query.id})

    await Chat.deleteMany({ seekerid: req.query.id})
    await Chatreport.deleteMany({ seekerid: req.query.id})
    await ChatStore.deleteMany({ seekerid: req.query.id})
    await ChatFeedBack.deleteMany({ userid: req.query.id})
    await CvSnedStore.deleteMany({userid: req.query.id})
    await Education.deleteMany({userid: req.query.id})

    await HelpFeedback.deleteMany({userid: req.query.id})
    await JobReport.deleteMany({userid: req.query.id})
    await JobSave.deleteMany({userid: req.query.id})
    await Protfoliolink.deleteMany({userid: req.query.id})
    await Resume.deleteMany({userid: req.query.id})
    await Profiledata.deleteMany({userid: req.query.id})
    await Skill.deleteMany({userid: req.query.id})
    await User.deleteMany({_id:  req.query.id})
    await ViewJob.deleteMany({userid: req.query.id})
    await Workexperience.deleteMany({userid: req.query.id})
    res.status(200).json({message: "all data remove this seeker"})


})







module.exports = app;