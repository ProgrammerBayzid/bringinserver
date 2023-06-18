
const express = require("express");
const app = express();
const bringinRouter = require('./Routers/router')
const signroute = require('./Routers/Sign_route/sign_route.js')
const profile = require('./Routers/Profile/profile.js')
const careerpreferance = require('./Routers/CarearPreferance/careerPreferences.js')
const profiledeteles = require('./Routers/Profiledetails/profiledetails')
const rusume = require('./Routers/Rusume/rusume')
const adminprofiledetails = require('./Routers/Adminprofiledetails/adminprofiledetails')
const registeryourcompany = require('./Routers/Registeryourcompany/registeryourcompany')
const recruiter_profile = require('./Routers/Recruiter/recruitersprofile.js')
const company = require('./Routers/Recruiter/company_registation.js')
const verify = require('./Routers/Recruiter/verify.js')

app.use(express.json());
app.use('/uploads', express.static('uploads'))
app.use(bringinRouter)
app.use(signroute)
app.use(profile)
app.use(careerpreferance)
app.use(profiledeteles)
app.use(rusume)
app.use(adminprofiledetails)
app.use(registeryourcompany)
app.use(recruiter_profile)
app.use(company)
app.use(verify)



module.exports=app