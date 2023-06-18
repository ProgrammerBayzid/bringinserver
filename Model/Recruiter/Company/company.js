const { Schema, model, } = require("mongoose");

const companySchema = Schema(
    {
        userid: String,
        legal_name: String,
        sort_name: String,
        industry: {
            type: "ObjectId",
            ref: "industries"
        },
        c_size: String,
        c_location: String,
        c_website: String,
    },

);

const companysizeSchema = Schema(
    {
        size: String
    },
);


var Companysize = model("Company_Size", companysizeSchema)


var Company = model("Company", companySchema)

module.exports = {
    Company,
    Companysize
}