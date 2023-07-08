const { Schema, model, } = require("mongoose");

const jobsaveSchema  =  Schema(
    {
        userid: "ObjectId",
        jobpostuserid: "ObjectId",
        jobid:{
            type:"ObjectID",
            ref: "job_post"
        }
    },{timestamps: true}
   
);

var JobSave = model("job_save", jobsaveSchema);

module.exports = JobSave;