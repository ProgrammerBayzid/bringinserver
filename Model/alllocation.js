const { Schema, model, } = require("mongoose");

const alllocationSchema  =  Schema(
    {
        name: String,
    },
   
);

module.exports.AllLocation = model("AllLocation", alllocationSchema);
