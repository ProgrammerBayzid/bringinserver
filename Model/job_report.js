const { Schema, model } = require("mongoose");

const jobreportSchema = Schema(
  {
    userid: "ObjectId",
    // userid: {
    //   type: "ObjectID",
    //   ref: "user",
    // },

    report: [
      {
        type: String,
      },
    ],
    image: String,
    jobid: {
      type: "ObjectID",
      ref: "job_post",
    },
    description: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

var JobReport = model("job_report", jobreportSchema);

module.exports = JobReport;
