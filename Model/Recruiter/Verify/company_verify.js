const { Schema, model, } = require("mongoose");

const companyverifySchema = Schema(
    {
        userid: String,
        fieldname: String,
        originalname: String,
        encoding: String,
        mimetype: String,
        destination: String,
        filename: String,
        path: String,
        size: Number
    },{timestamps: true}

);



var CompanyVerify = model("Company_Verify", companyverifySchema)

module.exports = {
    CompanyVerify
}