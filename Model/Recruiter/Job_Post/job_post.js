const { Schema, model } = require("mongoose");

const jobpostSchema = Schema(
  {
    userid: {
      type: "ObjectId",
      ref: "Recruiters_profile",
    },
    job_title: String,
    companyname: {
      type: String,
      default: null,
    },
    expertice_area: {
      type: "ObjectId",
      ref: "FunctionalArea",
    },
    job_description: String,
    experience: {
      type: "ObjectId",
      ref: "Experience",
    },
    education: {
      type: "ObjectId",
      ref: "Education_Lavel",
    },
    salary: {
      min_salary: {
        type: "ObjectId",
        ref: "Salary",
      },
      max_salary: {
        type: "ObjectId",
        ref: "Salary",
      },
    },
    company: {
      type: "ObjectId",
      ref: "Company",
    },
    skill: [
      {
        type: "ObjectId",
        ref: "default_Skill",
      },
    ],
    jobtype: {
      type: "ObjectId",
      ref: "Jobtype",
    },
    job_location: {
      lat: Schema.Types.Mixed,
      lon: Schema.Types.Mixed,
      formet_address: String,
      city: String,
    },
    remote: Boolean,
    job_status_type: Number,
    job_status: String,
    postdate: Date,
  },
  { timestamps: true }
);

var JobPost = model("job_post", jobpostSchema);

module.exports = JobPost;
