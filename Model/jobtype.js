const { Schema, model, } = require("mongoose");

const jobtypeSchema  =  Schema(
    {
        worktype:String
        },
   
);

module.exports.Jobtype = model("Jobtype", jobtypeSchema);
