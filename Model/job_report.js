const { Schema, model, } = require("mongoose");

const jobreportSchema  =  Schema(
    {
        userid: "ObjectId",
        report: [{
            type: String
        }],
        image: String,
        jobid:{
            type:"ObjectID",
            ref: "job_post"
        }
    },
   
);

var JobReport = model("job_report", jobreportSchema);

module.exports = JobReport;