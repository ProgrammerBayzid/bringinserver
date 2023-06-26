const { Schema, model, } = require("mongoose");

const viewjobSchema  =  Schema(
    {
        userid:{
            type: "ObjectId",
            ref: "User"
        },
        jobid: {
            type: "ObjectId",
            ref: "job_post"
        },
        jobpost_userid: {
            type: "ObjectId",
            ref: "Recruiters_profile"
        }
        

    },
   
);
var viewjob  = model("view_job", viewjobSchema);

module.exports = viewjob
