const { Schema, model, } = require("mongoose");

const career_preferencesSchema = Schema(
    {
        userid: {
            type: "ObjectId",
            ref: "User"
        },
        category: [{
            type: "ObjectId",
            ref: "Category"
        }],
        functionalarea: {
            type: "ObjectId",
            ref: "FunctionalArea"
        },
        division: {
            type: "ObjectId",
            ref: "Division"
        },
        jobtype: {
            type: "ObjectId",
            ref: "Jobtype"
        },
        salaray: {
            type: "ObjectId",
            ref: "Salary"
        }

    },

);



var Career_preferences = model("career_preferences", career_preferencesSchema)


module.exports = Career_preferences;
