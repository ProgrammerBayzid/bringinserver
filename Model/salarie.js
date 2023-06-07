const { Schema, model, } = require("mongoose");

const salirietypeSchema  =  Schema(
    {
        min_salary:String,
        max_salary:String,
        currency:String,

    },
   
);

module.exports.Salirietype = model("Salirietype", salirietypeSchema);
