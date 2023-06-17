const { Schema, model, } = require("mongoose");

const designationSchema  =  Schema(
    {
        designation: String,
    },
   
);
const departmentSchema  =  Schema(
    {
        department: String,
    },
   
);
const institutenameSchema  =  Schema(
    {
        institutename: String,
    },
   
);
const majorinSubjectSchema  =  Schema(
    {
        majorinSubject: String,
    },
   
);
const educationleveldegreeSchema  =  Schema({
   
    educationlevel:String,
    degree:String,
   
});


var Designation = model("Designation", designationSchema)

var Department = model("Department", departmentSchema)

var Institutename = model("Institutename", institutenameSchema)

var MajorinSubject = model ("MajorinSubject", majorinSubjectSchema)

var Educationleveldegree = model ("Educationleveldegree", educationleveldegreeSchema)


module.exports = {
    Designation,Department,Institutename,MajorinSubject,Educationleveldegree
};