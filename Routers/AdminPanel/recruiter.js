const express = require("express");
const app = express();
const Recruiters = require("../../Model/Recruiter/recruiters");
const candidatesave = require("../../Model/Recruiter/Candidate_Save/candidate_save");
const {
  Chat,
  Message,
  Chatreport,
  CandidateReject,
  ChatFeedBack,
} = require("../../Model/Chat/chat");
const ViewJob = require("../../Model/viewjob");
const JobPost = require("../../Model/Recruiter/Job_Post/job_post.js");
const CandidateReport = require("../../Model/Recruiter/Candidate_Report/candidate_report");
const CandidateView = require("../../Model/Recruiter/Candidate_View/candidate_view");
const ChatStore = require("../../Model/Chat/chat_store");
const {
  CompanyVerify,
} = require("../../Model/Recruiter/Verify/company_verify.js");
const { Company } = require("../../Model/Recruiter/Company/company");
const CvSnedStore = require("../../Model/cv_send_store");
const JobReport = require("../../Model/job_report");
const JobSave = require("../../Model/jobsave");
const Packagebuy = require("../../Model/Package/package_buy.js");
const {
  ProfileVerify,
} = require("../../Model/Recruiter/Verify/profile_verify");
const Recruiterfunction = require("../../Model/Recruiter/Recruiter_Functionarea/recruiter_functionarea");
const { HelpFeedback } = require("../../Model/Help&Feedback");
const { Resume } = require("../../Model/resumefile");
const {
  Workexperience,
  Education,
  DefaultSkill,
  Skill,
  Protfoliolink,
  About,
  CareerPreference,
  Profiledata,
} = require("../../Model/Seeker_profile_all_details");
const User = require("../../Model/userModel");

app.delete("/recruiter_delete", async (req, res) => {
  await CandidateReject.deleteMany({ userid: req.query.id });
  await CandidateReport.deleteMany({ userid: req.query.id });
  await candidatesave.deleteMany({ userid: req.query.id });
  await CandidateView.deleteMany({ userid: req.query.id });
  await Chat.deleteMany({ recruiterid: req.query.id });
  await Chatreport.deleteMany({ recruiterid: req.query.id });
  await ChatStore.deleteMany({ recruiterid: req.query.id });
  await ChatFeedBack.deleteMany({ recruiterid: req.query.id });
  await CompanyVerify.deleteMany({ userid: req.query.id });
  await Company.deleteMany({ userid: req.query.id });
  await CvSnedStore.deleteMany({ recruiterid: req.query.id });
  await JobPost.deleteMany({ userid: req.query.id });
  await JobReport.deleteMany({ jobpostuserid: req.query.id });
  await JobSave.deleteMany({ jobpostuserid: req.query.id });
  await Packagebuy.deleteMany({ recruiterid: req.query.id });
  await ProfileVerify.deleteMany({ userid: req.query.id });
  await Recruiterfunction.deleteMany({ userid: req.query.id });
  await Recruiters.deleteMany({ _id: req.query.id });
  await ViewJob.deleteMany({ jobpost_userid: req.query.id });
  res.status(200).json({ message: "all data remove this recruiter" });
});

app.delete("/recruiter_deletes/:_id", async (req, res) => {
  const recruiterId = req.params._id;

  try {
    await CandidateReject.deleteMany({ userid: recruiterId });
    await CandidateReport.deleteMany({ userid: recruiterId });
    await candidatesave.deleteMany({ userid: recruiterId });
    await CandidateView.deleteMany({ userid: recruiterId });
    await Chat.deleteMany({ recruiterid: recruiterId });
    await Chatreport.deleteMany({ recruiterid: recruiterId });
    await ChatStore.deleteMany({ recruiterid: recruiterId });
    await ChatFeedBack.deleteMany({ recruiterid: recruiterId });
    await CompanyVerify.deleteMany({ userid: recruiterId });
    await Company.deleteMany({ userid: recruiterId });
    await CvSnedStore.deleteMany({ recruiterid: recruiterId });
    await JobPost.deleteMany({ userid: recruiterId });
    await JobReport.deleteMany({ jobpostuserid: recruiterId });
    await JobSave.deleteMany({ jobpostuserid: recruiterId });
    await Packagebuy.deleteMany({ recruiterid: recruiterId });
    await ProfileVerify.deleteMany({ userid: recruiterId });
    await Recruiterfunction.deleteMany({ userid: recruiterId });
    await Recruiters.deleteMany({ _id: recruiterId });
    await ViewJob.deleteMany({ jobpost_userid: recruiterId });

    res
      .status(200)
      .json({ message: "All data for this recruiter has been removed" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while deleting data" });
  }
});

app.delete("/seeker_delete", async (req, res) => {
  try {
    await About.deleteMany({ userid: req.params.id });
    await CandidateReject.deleteMany({ candidateid: req.query.id });
    await CandidateReport.deleteMany({ candidateid: req.query.id });
    await candidatesave.deleteMany({ candidateid: req.query.id });
    await CandidateView.deleteMany({ candidate_id: req.query.id });
    await CareerPreference.deleteMany({ userid: req.query.id });
    await Chat.deleteMany({ seekerid: req.query.id });
    await Chatreport.deleteMany({ seekerid: req.query.id });
    await ChatStore.deleteMany({ seekerid: req.query.id });
    await ChatFeedBack.deleteMany({ userid: req.query.id });
    await CvSnedStore.deleteMany({ userid: req.query.id });
    await Education.deleteMany({ userid: req.query.id });
    await HelpFeedback.deleteMany({ userid: req.query.id });
    await JobReport.deleteMany({ userid: req.query.id });
    await JobSave.deleteMany({ userid: req.query.id });
    await Protfoliolink.deleteMany({ userid: req.query.id });
    await Resume.deleteMany({ userid: req.query.id });
    await Profiledata.deleteMany({ userid: req.query.id });
    await Skill.deleteMany({ userid: req.query.id });
    await User.deleteMany({ _id: req.query.id });
    await ViewJob.deleteMany({ userid: req.query.id });
    await Workexperience.deleteMany({ userid: req.query.id });
    res.status(200).json({ message: "all data removed for this seeker" });
  } catch (error) {
    console.error("An error occurred:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
});

app.delete("/seeker_deletes/:_id", async (req, res) => {
  try {
    const seekerId = req.params._id; // Use consistent parameter name

    await About.deleteMany({ userid: seekerId });
    await CandidateReject.deleteMany({ candidateid: seekerId });
    await CandidateReport.deleteMany({ candidateid: seekerId });
    await candidatesave.deleteMany({ candidateid: seekerId });
    await CandidateView.deleteMany({ candidate_id: seekerId });
    await CareerPreference.deleteMany({ userid: seekerId });
    await Chat.deleteMany({ seekerid: seekerId });
    await Chatreport.deleteMany({ seekerid: seekerId });
    await ChatStore.deleteMany({ seekerid: seekerId });
    await ChatFeedBack.deleteMany({ userid: seekerId });
    await CvSnedStore.deleteMany({ userid: seekerId });
    await Education.deleteMany({ userid: seekerId });
    await HelpFeedback.deleteMany({ userid: seekerId });
    await JobReport.deleteMany({ userid: seekerId });
    await JobSave.deleteMany({ userid: seekerId });
    await Protfoliolink.deleteMany({ userid: seekerId });
    await Resume.deleteMany({ userid: seekerId });
    await Profiledata.deleteMany({ userid: seekerId });
    await Skill.deleteMany({ userid: seekerId });
    await User.deleteMany({ _id: seekerId });
    await ViewJob.deleteMany({ userid: seekerId });
    await Workexperience.deleteMany({ userid: seekerId });

    res.status(200).json({ message: "All data removed for this seeker" });
  } catch (error) {
    console.error("An error occurred:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request" });
  }
});

module.exports = app;
