const { Schema, model, } = require("mongoose");

const jobsaveSchema  =  Schema(
    {
        userid: {
            type: "ObjectId",
            ref: "User"
        },
        jobpostuserid: {
            type: "ObjectId",
            ref: "Recruiters_profile"
        },
        jobid:{
            type:"ObjectID",
            ref: "job_post"
        }
    },{timestamps: true}
   
);

var JobSave = model("job_save", jobsaveSchema);

module.exports = JobSave;