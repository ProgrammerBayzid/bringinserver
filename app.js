
const express = require("express");
const app =express();
const bringinRouter = require('./Routers/router')
const signroute = require('./Routers/Sign_route/sign_route.js')
app.use(express.json());
app.use(bringinRouter)
app.use(signroute)



module.exports=app