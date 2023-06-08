const { Schema, model, } = require("mongoose");

const experienceSchema  =  Schema(
    {
        name: String
    },
   
);

var experience = model("Experience", experienceSchema);

module.exports = experience;