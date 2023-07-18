
const express = require("express");
const apps = express();
const Career_preferences = require("../../Model/career_preferences")

const Recruiter = require("../../Model/Recruiter/recruiters")




var sendNotification = function(data) {
    var headers = {
      "Content-Type": "application/json; charset=utf-8",
      "Authorization": "Basic NWUwMmExM2UtMmJlOC00YTEyLWE0ODUtMzE5NTAzZjYzMzhh"
    };
    
    var options = {
      host: "onesignal.com",
      port: 443,
      path: "/api/v1/notifications",
      method: "POST",
      headers: headers
    };
    
    var https = require('https');
    var req = https.request(options, function(res) {  
      res.on('data', function(data) {
        console.log("Response:");
        console.log(JSON.parse(data));
      });
    });
    
    req.on('error', function(e) {
      console.log("ERROR:");
      console.log(e);
    });
    
    req.write(JSON.stringify(data));
    req.end();
  };
  
  

  apps.post("/single_notification_send", async (req, res)=> {
    var message = { 
        app_id: "74463dd2-b8de-4624-a679-0221b4b0af85",
        data: req.body.data,
        contents: {"en": req.body.message},
        headings: {"en": req.body.title},
        include_player_ids: [req.body.playerid]
      };
      
      sendNotification(message);
      res.status(200).json({message: "notifiation send"})
  })




  async function notificaton_send_by_job(functionalid, recruiterid, mapdata) {
    var data = await Career_preferences.find({functionalarea: functionalid}).select({userid: 1}).populate([{path: "userid"},{path: "functionalarea"}])
    let notificationid = [];
    let functionalname = "";
    let enablentf = false;
    for (let index = 0; index < data.length; index++) {
       if(data[index]['userid']['other']['notification']['push_notification'] == true){
        notificationid.push(data[index]['userid']['other']['pushnotification'])
        functionalname = data[index]['functionalarea']['functionalname']
       }
        
    }
    var recruiterinfo = await Recruiter.findOne({_id: recruiterid})
    
    console.log(notificationid)
    
    var message = { 
        app_id: "74463dd2-b8de-4624-a679-0221b4b0af85",
        data: mapdata,
        contents: {"en": `${recruiterinfo.firstname} ${recruiterinfo.lastname} has posted a job for “${functionalname}”`},
        headings: {"en": `${recruiterinfo.firstname} ${recruiterinfo.lastname}`},
        include_player_ids: notificationid
      };

      
        sendNotification(message);
      
      
      
  }




  module.exports = {apps, notificaton_send_by_job}