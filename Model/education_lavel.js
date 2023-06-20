const { Schema, model, } = require("mongoose");

const educationlavelSchema = Schema(
    {
        name: String,
        digree: [{
            type: "ObjectId",
            ref: "digree"
        }]
    },

);

const digreeSchema = Schema(
    {
        name: String,
        education: {
            type: "ObjectID",
            ref: "Education_Lavel"
        },
        subject: [{
            type: "ObjectId",
            ref: "subject"
        }]
    },
);

const subjectSchema = Schema(
    {
        name: String,
        educaton: {
            type: "ObjectID",
            ref: "Education_Lavel"
        },
        digree: {
            type: "ObjectId",
            ref: "digree"
        },
        
    },
);



var EducationLavel = model("Education_Lavel", educationlavelSchema)
var Digree = model("digree", digreeSchema)
var Subject = model("subject", subjectSchema)

module.exports = {
    EducationLavel,
    Digree,
    Subject
};
