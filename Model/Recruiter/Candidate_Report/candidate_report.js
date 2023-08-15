const { Schema, model } = require("mongoose");

const candidatereportSchema = Schema(
  {
    userid: "ObjectId",
    report: [
      {
        type: String,
      },
    ],
    image: String,
    candidateid: {
      type: "ObjectID",
      ref: "User",
    },
    candidatefulldetailsid: {
      type: "ObjectID",
      ref: "seeker_profiledata",
    },
    description: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

var CandidateReport = model("Candidate_Report", candidatereportSchema);

module.exports = CandidateReport;
