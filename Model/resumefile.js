const { Schema, model, } = require("mongoose");

const resumeSchema  =  Schema(
    {
       
        resume:String,
        userid:String

    },
   
);

module.exports.Resume = model("Resume", resumeSchema);
