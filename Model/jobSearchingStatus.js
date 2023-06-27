const { Schema, model, } = require("mongoose");

const jobSearchingStatusSchema  =  Schema(
    {
        jobhuntingstatus: String,
        morestatus:String,
        lookingforanyjob:String
    },
   
);

module.exports.JobSearchingStatus = model("JobSearchingStatus", jobSearchingStatusSchema);
