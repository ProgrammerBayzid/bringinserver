const { Schema, model, } = require("mongoose");

const workexperienceSchema  =  Schema(
    {
        companyname:String,
        industry:String,
        starttoend:String,
        expertisearea:String,
        designation:String,
        department:String,
        dutiesandresponsibilities:String,
        careermilestones:String,

    },
   
);

module.exports.Workexperience = model("Workexperience", workexperienceSchema);
