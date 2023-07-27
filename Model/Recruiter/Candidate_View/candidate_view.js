const { Schema, model, } = require("mongoose");

const candidateSchema = Schema(
    {
        userid: {
            type: "ObjectId",
            ref: "Recruiters_profile"
        },
        candidate_profileid: {
            type: "ObjectId",
            ref: "seeker_profiledata"
        },
        candidate_id: {
            type: "ObjectId",
            ref: "User"
        }
    },{timestamps: true}

);




var CandidateView = model("Candidate_View", candidateSchema)

module.exports = CandidateView