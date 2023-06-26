const { Schema, model, } = require("mongoose");

const resumeSchema  =  Schema(
    {
       
        resume:{},
        userid:{
            type: "ObjectID",
            ref: "User"
        }

    },
   
);

module.exports.Resume = model("Resume", resumeSchema);
