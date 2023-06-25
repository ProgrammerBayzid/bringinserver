const express = require("express");
const app = express();
const User = require("../../Model/userModel");
const tokenverify = require("../../MiddleWare/tokenverify.js");
const jwt = require("jsonwebtoken");
const Experince = require("../../Model/experience.js");
const { Chat, Message } = require("../../Model/Chat/chat")
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

        // socket.on("channelid", async (channelid) => {
        //     console.log(channelid)
        //     socket.on(channelid.toString(), (message) => {
        //         messagesend(message, io, channelid)
        //     })
        //     var oldmessage = await Message.find({ channel: channelid })
        //     io.emit(`oldmessage${channelid}`, oldmessage)

        //     socket.on('disconnect', (data)=>{
        //         console.log("1 room disconnect")
        //     })
        // })

        socket.on("channellistroom", (currentid)=>{
            socket.join(currentid)
        })


        socket.on("channellist", async (channellist) => {
            var channellistdata;
            if (channellist.seeker == true) {
                channellistdata = await Chat.find({ seekerid: channellist.currentid }).populate([{ path: "seekerid" }, { path: "recruiterid" }])
            }else{
                channellistdata = await Chat.find({ recruiterid: channellist.currentid }).populate([{ path: "seekerid" }, { path: "recruiterid" }])
            }
            io.to(channellist.currentid).emit("channellist", channellistdata)
            
        })

        

        socket.on("channel", (channel) => {
            socket.join(channel)
            console.log(`${channel} join a user`)
        })

        socket.on("messagelist", async (channelid) => {
            var message = await Message.find({ channel: channelid });
            //     io.emit(`messagelist${channel}`, message)
            console.log(channelid)
            io.to(channelid.toString()).emit(`messagelist`, message)
        })


        socket.on("message", async (message) => {
            var data = await Message({ channel: message.channelid, message: message.message })
            data.save()
            await Chat.findOneAndUpdate({ _id: message.channelid }, { $set: { lastmessage: data } })
            io.to(message.channelid).emit("singlemsg", message)
        })

    })

    io.on('disconnect', (socket) => {
        console.log("1 user disconnect")
    })
}



module.exports = SocketRoute