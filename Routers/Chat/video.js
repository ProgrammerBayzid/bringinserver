const express = require("express");

const tokenverify = require("../../MiddleWare/tokenverify.js");
const jwt = require("jsonwebtoken");
const {v4: uuidV4} = require('uuid')
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads");
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });

const app =  express();


app.get('/', (req, res)=>{
    res.redirect(`/${uuidV4()}`)
})


app.get('/:room', (req, res)=>{
    res.render('room', {roomid: req.params.room})
})




module.exports = app