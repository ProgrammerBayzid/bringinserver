
const express = require("express");
const app =express();
const bringinRouter = require('./Routers/router')
app.use(express.json());
app.use(bringinRouter)



module.exports=app