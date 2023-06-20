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
        c_size: {
            type: "ObjectId",
            ref: "Company_Size"
        },
        c_location: {
            lat: Number,
            lon: Number,
            formet_address: String,
            city: String
        },
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