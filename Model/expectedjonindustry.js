const { Schema, model, } = require("mongoose");

const expectedjobindustrySchema  =  Schema(
    {
        name: String,
        parent_industry_name:String
    },
   
);

module.exports.JobIndustry = model("JobIndustry", expectedjobindustrySchema);
