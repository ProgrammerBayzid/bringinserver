const { Schema, model, } = require("mongoose");

const candidatereportSchema  =  Schema(
    {
        userid: "ObjectId",
        report: [{
            type: String
        }],
        image: String,
        candidateid:{
            type:"ObjectID",
            ref: "User"
        }
    },
   
);

var CandidateReport = model("Candidate_Report", candidatereportSchema);

module.exports = CandidateReport;