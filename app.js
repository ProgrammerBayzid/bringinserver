const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const bringinRouter = require("./Routers/router");
const signroute = require("./Routers/Sign_route/sign_route.js");
const profile = require("./Routers/Profile/profile.js");
const careerpreferance = require("./Routers/CarearPreferance/careerPreferences.js");
const profiledeteles = require("./Routers/Seeker/profiledetails");
const rusume = require("./Routers/Rusume/rusume");
const adminprofiledetails = require("./Routers/Adminprofiledetails/adminprofiledetails");
const recruiter_profile = require("./Routers/Recruiter/recruitersprofile.js");
const company = require("./Routers/Recruiter/company_registation.js");
const verify = require("./Routers/Recruiter/verify.js");
const cv = require("./Routers/Cv/cv.js");
const jobpost = require("./Routers/Recruiter/job_post");
const adminapi = require("./Routers/Admin_Api/admin_api");
const seekerjob = require("./Routers/Seeker/joblist.js");
const email = require("./Routers/Email/email.js");
const candidate = require("./Routers/Recruiter/candidate.js");
const jobSearchingStatus = require("./Routers/JobSearchingStatus/jobSearchingStatus.js");
const adminPanel = require("./Routers/AdminPanel/adminpa");
const chatrestapi = require("./Routers/Chat/chat_restapi");
const clintsiteapi = require("./Routers/ClintSiteApi/clintsiteapi.js");
const education = require("./Routers/Seeker/education");
const emailtest = require("./Routers/Emailtest/emailtest");
const { apps } = require("./Routers/Notification/notification");
const admin_recriter = require("./Routers/AdminPanel/recruiter")
const Package = require("./Routers/Recruiter/package")

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));
app.use("/resumes", express.static("resumes"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bringinRouter);
app.use(signroute);
app.use(profile);
app.use(careerpreferance);
app.use(profiledeteles);
app.use(rusume);
app.use(adminprofiledetails);
app.use(recruiter_profile);
app.use(company);
app.use(verify);
app.use(cv);
app.use(jobpost);
app.use(adminapi);
app.use(seekerjob);
app.use(email);
app.use(adminPanel);
app.use(candidate);
app.use(jobSearchingStatus);
app.use(chatrestapi);
app.use(clintsiteapi);
app.use(education);
app.use(emailtest);
app.use(apps);
app.use(admin_recriter)
app.use(Package)

app.get("/", (req, res) => {
  res.send(req.headers);
});

module.exports = app;
