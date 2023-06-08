
const express = require("express");
const app = express();
const bringinRouter = require('./Routers/router')
const signroute = require('./Routers/Sign_route/sign_route.js')
const profile = require('./Routers/Profile/profile.js')
const careerpreferance = require('./Routers/CarearPreferance/careerPreferences.js')
app.use(express.json());
app.use(bringinRouter)
app.use(signroute)
app.use(profile)
app.use(careerpreferance)



module.exports=app