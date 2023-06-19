const { Schema, model, } = require("mongoose");

const jobSearchingStatusSchema  =  Schema(
    {
        jobhuntingstatus: String,
        morestatus:String,
        lookingforanyjob:{
            type: Boolean,
            default: false
        },
    },
   
);

module.exports.JobSearchingStatus = model("JobSearchingStatus", jobSearchingStatusSchema);
