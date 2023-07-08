const { Schema, model, } = require("mongoose");

const resumeSchema  =  Schema(
    {
       
        resume:{},
        userid:{
            type: "ObjectID",
            ref: "User"
        },
        uploadtime: Date

    },{timestamps: true}
   
);

module.exports.Resume = model("Resume", resumeSchema);
