const { Schema, model, } = require("mongoose");

const alllocationSchema  =  Schema(
    {
        name: String,
        parent_division_name :String
    },
   
);

module.exports.AllLocation = model("AllLocation", alllocationSchema);
