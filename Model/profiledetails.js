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
  allskill: [
    {
      skillname1: String,
      skillname2: String,
      skillname3: String,
      skillname4: String,
      skillname5: String,
    },
  ],
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
  expectedjobindustry: [
    {
      jobindustry1: {
        type: "ObjectId",
        ref: "industries",
      },
      jobindustry2: {
        type: "ObjectId",
        ref: "industries",
      },
      jobindustry3: {
        type: "ObjectId",
        ref: "industries",
      },
    },
  ],
  expertisearea: String,
  expectedjoblocation: String,
  jobtype: {
    type: "ObjectId",
    ref: "Jobtype",
  },
  expectedsalary: {
    type: "ObjectId",
    ref: "Salirietype",
  },
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
  Profiledata,
};
