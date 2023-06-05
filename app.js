
const express = require("express");
const app =express();
app.use(express.json());
const bringinRouter = require('./Routers/router')
app.use(bringinRouter)



module.exports=app