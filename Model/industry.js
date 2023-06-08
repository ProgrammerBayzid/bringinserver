const { Schema, model, } = require("mongoose");

const industrySchema  =  Schema(
    {
        industryname:String, 
    },
   
);



const categorySchema  =  Schema(
    {
        industryid: {
            type: "ObjectId",
            ref: "Industry"
        },
        categoryname: String
    },
   
);


const functionalareaSchema  =  Schema(
    {
        industryid: String,
        categoryid: String,
        functionalname: String
    },
   
);

var Functionarea = model("FunctionalArea", functionalareaSchema)

var Category = model("Category", categorySchema)

var Expertisearea = model("Industry", industrySchema)

module.exports = {
    Expertisearea,Category,Functionarea
};
