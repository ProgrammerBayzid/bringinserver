const { Schema, model, } = require("mongoose");

const jobsaveSchema  =  Schema(
    {
        userid: "ObjectId",
        jobpostuserid: "ObjectId",
        jobid:{
            type:"ObjectID",
            ref: "job_post"
        }
    },
   
);

var JobSave = model("job_save", jobsaveSchema);

module.exports = JobSave;