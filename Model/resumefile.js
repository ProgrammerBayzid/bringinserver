const { Schema, model, } = require("mongoose");

const resumeSchema  =  Schema(
    {
       
        resume:{},
        userid:{
            type: "ObjectID",
            ref: "User"
        },
        uploadtime: Date

    },
   
);

module.exports.Resume = model("Resume", resumeSchema);
