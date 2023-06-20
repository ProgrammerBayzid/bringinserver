const { Schema, model, } = require("mongoose");

const skillSchema = Schema(
    {
        userid: String,
        skill: String
    },

);



var Skill = model("skill", skillSchema)

module.exports = Skill