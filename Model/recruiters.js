const { Schema, model, } = require("mongoose");

const recruitersSchema  =  Schema(
    {
        firstname:String,
        lastname:String,
        companyname:String,
        designation:String,
        email:String,
        image:String

        },
   
);

module.exports.Recruiters = model("Recruiters", recruitersSchema);
