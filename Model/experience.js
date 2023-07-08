const { Schema, model, } = require("mongoose");

const experienceSchema  =  Schema(
    {
        name: String
    },{timestamps: true}
   
);

var experience = model("Experience", experienceSchema);

module.exports = experience;