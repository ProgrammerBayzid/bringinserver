const { Schema, model } = require("mongoose");

const packageBuySchema = Schema(
    {
        packageid: {
            type: "ObjectId",
            ref: "Packages"
        },
        recruiterid: {
            type: "ObjectId",
            ref: "Recruiters_profile"
        },
        starddate: {
            type: Number
        },
        enddate: {
            type: Number
        },
        active_type: {
            type: Number,
            default: 1
        },
        active: {
            type : Boolean,
            default: true
        },
        transactionID: {}

    },
    { timestamps: true }
);





var PackageBuy = model("Packages_buy", packageBuySchema);

module.exports = PackageBuy;
