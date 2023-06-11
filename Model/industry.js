const { Schema, model, } = require("mongoose");

const industrySchema  =  Schema(
    {
        industryname:String, 
    },
   
);


const addjobtypeSchema = Schema(
    {
        jobetype: String
    }
)
const addsalarietypeSchema = Schema(
    {
        salarietype: String
    }
)



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
        industryid: {
            type: "ObjectId",
            ref: "Industry"
        },
        
        categoryid:{
            type:"ObjectId",
            ref:"Category"
        },
        jobetypeid:{
            type:"ObjectId",
            ref:"Addjobetype"
        },
        salarietypeid:{
            type:"ObjectId",
            ref:"Addsalarietype"
        },

        functionalname: String
    },
   
);

var Functionarea = model("FunctionalArea", functionalareaSchema)

var Category = model("Category", categorySchema)

var Expertisearea = model("Industry", industrySchema)

var Addjobtype = model ("Addjobtype", addjobtypeSchema)

var Addsalarietype = model ("Addsalarietype", addsalarietypeSchema)

module.exports = {
    Expertisearea,Category,Functionarea,Addjobtype,Addsalarietype
};
