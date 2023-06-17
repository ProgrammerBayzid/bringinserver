const { Schema, model } = require("mongoose");

const workexperienceSchema = Schema({
  companyname: String,
  industryname: String,
  starttoend: String,
  expertisearea: String,
  designation: String,
  department: String,
  dutiesandresponsibilities: String,
  careermilestones: String,
  userid: String,
});

const educationlavelSchema = Schema({
  institutename: String,
  educationallevel: String,
  subject: String,
  grade: String,
  starttoend: String,
  userid: String,
});

const skillSchema = Schema({
  skillname: String,
  userid: String,
});
const protfoliolinkSchema = Schema({
  protfoliolink: String,
  userid: String,
});
const aboutSchema = Schema({
  about: String,
  userid: String,
});
const careerpreferenceSchema = Schema({
  expectedjobindustry: String,
  expertisearea: String,
  expectedjoblocation: String,
  jobtype: String,
  expectedsalary: String,
  userid: String,
});

const allprofiledataSchema = Schema({
  workexperience: {
    type: "ObjectId",
    ref: "Workexperience",
  },
  education: {
    type: "ObjectId",
    ref: "Education",
  },
  skill: {
    type: "ObjectId",
    ref: "Skill",
  },
  protfoliolink: {
    type: "ObjectId",
    ref: "Protfoliolink",
  },
  about: {
    type: "ObjectId",
    ref: "About",
  },
  careerPreference: {
    type: "ObjectId",
    ref: "CareerPreference",
  },
 
});

var Workexperience = model("Workexperience", workexperienceSchema);

var Education = model("Education", educationlavelSchema);

var Skill = model("Skill", skillSchema);

var Protfoliolink = model("Protfoliolink", protfoliolinkSchema);

var About = model("About", aboutSchema);

var CareerPreference = model("CareerPreference", careerpreferenceSchema);

var Profiledata = model("Profiledata", allprofiledataSchema);

module.exports = {
  Workexperience,
  Education,
  Skill,
  Protfoliolink,
  About,
  CareerPreference,
  Profiledata
};
