const { Schema, model, } = require("mongoose");



const candidateSaveSchema = Schema(
    {
        userid: "ObjectId",
        candidateid: "ObjectId",
        candidatefullprofile: {
            type: "ObjectId",
            ref: "seeker_profiledata"
        }
    },
);


var SandidateSave = model("Candidate_Save", candidateSaveSchema)




module.exports = SandidateSave