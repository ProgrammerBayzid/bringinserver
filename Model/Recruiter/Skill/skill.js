const { Schema, model, } = require("mongoose");

const skillSchema = Schema(
    {
        userid: String,
        skill: String
    },{timestamps: true}

);



var Skill = model("skill", skillSchema)

module.exports = Skill