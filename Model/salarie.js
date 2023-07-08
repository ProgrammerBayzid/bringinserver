const { Schema, model, } = require("mongoose");

const salirietypeSchema  =  Schema(
    {
        min_salary:String,
        max_salary:String,
        currency:String,

    },{timestamps: true}
   
);

module.exports.Salirietype = model("Salary", salirietypeSchema);
