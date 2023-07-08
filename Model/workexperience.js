const { Schema, model, } = require("mongoose");

const workexperienceSchema  =  Schema(
    {
        companyname:String,
        industry:String,
        starttoend:String,
        expertisearea:String,
        designation:String,
        department:String,
        dutiesandresponsibilities:String,
        careermilestones:String,
        intern:{
            type: Boolean,
            default: false
        },
        hideprofessionaldetails:{
            type: Boolean,
            default: false
        },

    },{timestamps: true}
   
);

module.exports.Workexperience = model("Workexperience", workexperienceSchema);
