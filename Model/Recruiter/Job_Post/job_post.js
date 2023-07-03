const { Schema, model, } = require("mongoose");

const jobpostSchema = Schema(
    {
        userid: {
            type: "ObjectId",
            ref: "Recruiters_profile"
        },
        job_title: String,
        expertice_area: {
            type: "ObjectId",
            ref: "FunctionalArea"
        },
        job_description: String,
        experience: {
            type: "ObjectId",
            ref: "Experience"
        },
        education: {
            type: "ObjectId",
            ref: "Education_Lavel"
        },
        salary: {
            type: "ObjectId",
            ref: "Salary"
        },
        company: {
          type: "ObjectId",
          ref: "Company"
        },
        skill: [{
            type: "ObjectId",
            ref: "default_Skill"
        }],
        jobtype: {
            type: "ObjectId",
            ref: "Jobtype"
        },
        remote: Boolean,
        job_status_type: Number,
        job_status: String,
        postdate: Date

    },{timestamps: true}

);



var JobPost = model("job_post", jobpostSchema)

module.exports = JobPost