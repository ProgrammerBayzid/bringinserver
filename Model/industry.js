const { Schema, model, } = require("mongoose");

const industrySchema  =  Schema(
    {
        industryname:String, 
        category: [{
            type: "ObjectId",
            ref: "Category"
        }]
        
    },
   
);


const categorySchema  =  Schema(
    {
        industryid: {
            type: "ObjectId",
            ref: "industries"
        },
        categoryname: String,
        
    },
   
);


const functionalareaSchema  =  Schema(
    {
        industryid: {
            type: "ObjectId",
            ref: "industries"
        },
        
        categoryid:{
            type:"ObjectId",
            ref:"Category"
        },
        functionalname: String,
        
    },
   
);



var Functionarea = model("FunctionalArea", functionalareaSchema)

var Category = model("Category", categorySchema)

var Expertisearea = model("industries", industrySchema)




module.exports = {
    Expertisearea,Category,Functionarea
};
