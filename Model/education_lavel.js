const { Schema, model, } = require("mongoose");

const educationlavelSchema  =  Schema(
    {
        name: String,
    },
   
);



var EducationLavel  = model("Education_Lavel", educationlavelSchema)


module.exports = EducationLavel;
