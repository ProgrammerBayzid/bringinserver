const express = require("express");
const app = express();
const User = require("../../Model/userModel");
const Recruiter = require("../../Model/Recruiter/recruiters");
const tokenverify = require("../../MiddleWare/tokenverify.js");
const jwt = require("jsonwebtoken");
const Experince = require("../../Model/experience.js");
const { Chat, Message } = require("../../Model/Chat/chat")
const { single_msg_notifiation } = require("../../Routers/Notification/notification")
const multer = require("multer");
const fs = require("fs");
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


async function singlemessage(message) {
    var data = await Message({ channel: message.channelid, message: message.message })
    data.save()
    await Chat.findOneAndUpdate({ _id: message.channelid }, {
        $set: { lastmessage: data },
        $inc: { recruiter_unseen: seekerincrement(message) ,seeker_unseen: recruiterincrement(message)}
    })
    single_msg_notifiation(message.channelid, message.message.user.customProperties)

}

function seekerincrement(message) {
    if (message.message.user.customProperties['recruiter'] == false && message.message.customProperties['seen'] == false) {
        return 1;
    } else if (message.message.user.customProperties['recruiter'] == false && message.message.customProperties['seen'] == true) {
        return 0;
    } else{
        return 0;
    }
}

function recruiterincrement(message) {
    if (message.message.user.customProperties['recruiter'] == true && message.message.customProperties['seen'] == false) {
        return 1;
    } else if (message.message.user.customProperties['recruiter'] == true && message.message.customProperties['seen'] == true) {
        return 0;
    }else{
        return 0;
    }
}

async function recruiterseen(id) {
    await Chat.findOneAndUpdate({ _id: id },{$set: {recruiter_unseen: 0}})
}
async function seekerseen(id) {
    await Chat.findOneAndUpdate({ _id: id },{$set: {seeker_unseen: 0}})
}

async function SocketRoute(io) {
    io.on('connection', (socket) => {

        console.log("1 user connect")
        
        socket.on('channelcreate', async (channel) => {
            console.log(channel)
            // channelcreate(channel, io)
            var data = await Chat.findOne({ seekerid: channel.seekerid, recruiterid: channel.recruiterid }).populate([{ path: "seekerid" }, { path: "recruiterid" }])
            if (data == null) {
                var channeldata = await Chat({ seekerid: channel.seekerid, recruiterid: channel.recruiterid, date: new Date() });
                channeldata.save();
                var channelinfo = await Chat.findOne({ _id: channeldata._id }).populate([{ path: "seekerid" }])
                io.emit("channeldata", channelinfo)
            } else {
                io.emit("channeldata", data)
            }
        })


        // socket.on("channellistroom", (currentid) => {
        //     socket.join(currentid)
        // })


        // socket.on("channellist", async (channellist) => {
        //     var channellistdata;
        //     if (channellist.seeker == true) {
        //         channellistdata = await Chat.find({ seekerid: channellist.currentid }).sort({ updatedAt: -1 }).populate([{ path: "seekerid" }, { path: "recruiterid", populate: { path: "companyname", populate: { path: "industry" } } }, { path: "lastmessage" }])
        //     } else {
        //         channellistdata = await Chat.find({ recruiterid: channellist.currentid }).sort({ updatedAt: -1 }).populate([{ path: "seekerid" }, { path: "recruiterid", populate: { path: "companyname", populate: { path: "industry" } } }, { path: "lastmessage" }])
        //     }
        //     io.to(channellist.currentid).emit("channellist", channellistdata)
        // })


        // channel join
        socket.on("channel", (channel) => {
            socket.join(channel)
            console.log(`${channel} join a user`)
        })


        // message list get
        socket.on("messagelist", async (channelid) => {
            var message = await Message.find({ channel: channelid });
            //     io.emit(`messagelist${channel}`, message)
            console.log(channelid)
            io.to(channelid.toString()).emit(`messagelist`, message)
        })

        //message snef
        socket.on("message", async (message) => {
            Promise.all([singlemessage(message)])
            io.to(message.channelid).emit("singlemsg", message)
        })

        // socket.on('req_msg_update', async (data) => {
        //     console.log(data)
        //     await Message.findOneAndUpdate({ _id: data.msgid }, {
        //         $set: { "message.customProperties.request": 0 }
        //     })
        //     var message = await Message.find({ channel: data.channelid });
        //     io.to(data.channelid.toString()).emit(`messagelist`, message)
        // })


        // imageupload
        socket.on("file_upload", async (filedata) => {
            fs.writeFileSync(`./uploads/${filedata.name}`, filedata.base64, { encoding: 'base64' });
            var data = await Message({ channel: filedata.channelid, message: filedata.message })
            data.save()
            await Chat.findOneAndUpdate({ _id: filedata.channelid }, { $set: { lastmessage: data } })
            io.to(filedata.channelid).emit("imageupload", data)
            // io.to(filedata.channelid).emit("singlemsg", data)
            // single_msg_notifiation(filedata.channelid, filedata.message.user.customProperties)
        })

        
        // block user
        socket.on("block_user", async (blockdata) => {
            await Chat.findOneAndUpdate({ _id: blockdata.channelid }, {
                $set: {
                    seekerblock: blockdata.seekerblock,
                    recruiterblock: blockdata.recruiterblock
                }
            });
            io.to(blockdata.channelid).emit("block_user", blockdata)
        })


        // active detected
        socket.on("active", async (data) => {
            if (data['isrecruiter'] == true) {
                Promise.all([Recruiter.findOneAndUpdate({ _id: data['userid'] }, { $set: { "other.online": true } })])
            } else {
                Promise.all([User.findOneAndUpdate({ _id: data['userid'] }, { $set: { "other.online": true } })])
            }
        })


        // inactive detected
        socket.on("inactive", async (data) => {
            if (data['isrecruiter'] == true) {
                Promise.all([Recruiter.findOneAndUpdate({ _id: data['userid'] }, { $set: { "other.online": false , "other.offlinedate": new Date().getTime()} })])
            } else {
                Promise.all([User.findOneAndUpdate({ _id: data['userid'] }, { $set: { "other.online": false , "other.offlinedate": new Date().getTime()} })])
            }
        })
       
        // seeker inbox join
        socket.on("seeker_join", (data) => {
            console.log(`seeker join done ${data}`)
            io.to(data).emit("seeker_join", true)
            seekerseen(data)
            
        })

        // seeker inbox leave
        socket.on("seeker_leave", (data) => {
            console.log(`seeker leave done ${data}`)
            io.to(data).emit("seeker_join", false)
        })

        // recruiter inbox join
        socket.on("recruiter_join", (data) => {
            console.log(`recruiter join done ${data}`)
            io.to(data).emit("recruiter_join", true)
            recruiterseen(data)
        })

        // recruiter inbox leave
        socket.on("recruiter_leave", (data) => {
            console.log(`recruiter leave done ${data}`)
            io.to(data).emit("recruiter_join", false)
        })
    })

    io.on('disconnect', (socket) => {
        console.log("1 user disconnect")
    })
}



module.exports = SocketRoute