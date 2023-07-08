const { Schema, model, } = require("mongoose");

const jobtypeSchema  =  Schema(
    {
        worktype:String
        },{timestamps: true}
   
);

module.exports.Jobtype = model("Jobtype", jobtypeSchema);
