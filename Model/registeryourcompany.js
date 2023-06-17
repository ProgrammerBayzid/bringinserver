const { Schema, model, } = require("mongoose");

const registeryourcompanySchema  =  Schema(
    {
        companyname: String,
        industryname: String,
          companysize:String,
          companylocation:String,
          companywebsite:String,
          userid: String,
    },
   
);

module.exports.Registeryourcompany = model("Registeryourcompany", registeryourcompanySchema);
