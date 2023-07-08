const { Schema, model, } = require("mongoose");

const expertiseareaSchema  =  Schema(
    {
        name: String,
        parent_industry_name:String,
        parent_category_name: String
    },{timestamps: true}
   
);

module.exports.Expertisearea = model("Expertisearea", expertiseareaSchema);
