const { Schema, model, } = require("mongoose");

const jobSearchingStatusSchema  =  Schema(
    {
        jobhuntingstatus: String,
        morestatus:String,
        lookingforanyjob:Boolean
    },
   
);

module.exports.JobSearchingStatus = model("JobSearchingStatus", jobSearchingStatusSchema);
