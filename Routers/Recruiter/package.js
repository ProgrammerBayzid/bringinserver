const express = require("express");
const app = express();
const tokenverify = require("../../MiddleWare/tokenverify.js")
const jwt = require('jsonwebtoken');
const multer = require("multer");
const Recruiters = require("../../Model/Recruiter/recruiters");
const Package = require("../../Model/Package/package.js")
const PackageBuy = require("../../Model/Package/package_buy.js")
const axios = require("axios");
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


let sendbox = true;

const store_id = sendbox ? "aamarpaytest" :"bringin";
const signature_key = sendbox ? "dbb74894e82415a2f7ff0ec3a97e4183" : "cdc5d825cb402db73c2a60b80bf0f1b7"
const url = sendbox ? "https://sandbox.aamarpay.com" : "https://secure.aamarpay.com"

app.post("/packagebuy", tokenverify, async (req, res) => {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                var id = authdata._id;
                // Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })
                let startdate = new Date()
                let enddate = new Date()
                enddate.setMonth(startdate.getMonth()+1)
                // let startdate =  Date(date.getUTCFullYear(), date.getUTCMonth(),date.getUTCDay(), date.getUTCHours(), date.getUTCMinutes())
                // let enddate =  Date(date.getUTCFullYear(), date.getUTCMonth() + 1,date.getUTCDay(), date.getUTCHours(), date.getUTCMinutes())
                // res.status(200).json({dsddssv: startdate.getTime(), end: enddate.getTime()})

                var amarpaydata = await axios.post(
                  `${url}/api/v1/trxcheck/request.php?request_id=${req.body.transactionID}&store_id=${store_id}&signature_key=${signature_key}&type=json`
                )
                // date.setMonth(date.getMonth()+2)
                //  console.log(date)
                 console.log(enddate.getTime)
                var packagedata = await PackageBuy.findOne({recruiterid: id, packageid: req.body.packageid, active: true})
                if(packagedata == null){
                  var pack =  await PackageBuy({
                    transactionID: amarpaydata.data,
                    recruiterid: id, packageid: req.body.packageid,
                    starddate: startdate.getTime(),
                    enddate: enddate.getTime(),
                
                });
                    pack.save();
                    await Recruiters.findOneAndUpdate({_id: id}, {$set: {"other.package": pack._id, "other.premium": true}})
                    res.status(200).json({message: "Package buy successfully"})
                }else{
                    res.status(400).json({message: "Already buy a package"});
                }


            }
        })

    } catch (error) {
        res.send(error);
    }


})


app.get('/user_payment_history',tokenverify, async (req, res) =>{
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                var id = authdata._id;
               var data = await PackageBuy.find({recruiterid: id}).populate([{ path: "packageid" }, {path: "recruiterid"}])
               res.status(200).send(data)
            }
        })

    } catch (error) {
        res.send(error);
    }
})




app.post('/subscription_cancle', tokenverify, async (req, res)=> {
    try {
        jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
            if (err) {
                res.json({ message: "invalid token" })
            } else {
                var id = authdata._id;
               var data = await PackageBuy.findOneAndUpdate({recruiterid: id, _id: req.body.id}, {$set: {active_type: 2, active: false}}).populate([{ path: "packageid" }, {path: "recruiterid"}])
               if(data == null) {
                res.status(200).json({message: "active package not found"})
               }else{
                await Recruiters.findOneAndUpdate({_id: id}, {$set: {"other.premium": false}})
                res.status(200).json({message: "Subscription cancel successfully"})
               }
            }
        })

    } catch (error) {
        res.send(error);
    }
})



module.exports = app