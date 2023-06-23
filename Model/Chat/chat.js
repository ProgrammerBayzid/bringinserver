const { Schema, model, } = require("mongoose");

const chatSchema  =  Schema(
    {
        seekerid:{
            type: "ObjectId",
            ref: "User"
        },
        recruiterid: {
            type: "ObjectId",
            ref: "Recruiters_profile"
        },
        date: Date,
        lastmessage: {
            type: "ObjectId",
        }
    },{timestamps: true},
   
);


const messageSchema  =  Schema(
    {
        channel : {
            type: "ObjectId",
            ref : "Chat_channel"
        },
        message: {

        }
    },{timestamps: true},
   
);



var Chat  = model("Chat_channel", chatSchema)
var Message = model("messagelist", messageSchema)

module.exports = {Chat,Message}
