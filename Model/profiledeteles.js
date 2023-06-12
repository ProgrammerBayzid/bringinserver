const { Schema, model } = require("mongoose");

const workexperienceSchema = Schema({
  companyname: String,
  industry: String,
  starttoend: String,
  expertisearea: String,
  designation: String,
  department: String,
  dutiesandresponsibilities: String,
  careermilestones: String,
});

const educationlavelSchema = Schema({
  institutename: String,
  educationallevel: String,
  subject: String,
  grade: String,
  starttoend: String,
});

const skillSchema = Schema({
  skillname: String,
});
const protfoliolinkSchema = Schema({
  protfoliolink: String,
});
const aboutSchema = Schema({
  workid: {
    type: "ObjectId",
    ref: "Workexperience",
  },
  educationid: {
    type: "ObjectId",
    ref: "Education",
  },
  skillid: {
    type: "ObjectId",
    ref: "Skill",
  },
  Protfolioid: {
    type: "ObjectId",
    ref: "Protfoliolink",
  },

  about: String,
});

var Workexperience = model("Workexperience", workexperienceSchema);

var Education = model("Education", educationlavelSchema);

var Skill = model("Skill", skillSchema);

var Protfoliolink = model("Protfoliolink", protfoliolinkSchema);

var About = model("About", aboutSchema);

module.exports = {
  Workexperience,
  Education,
  Skill,
  Protfoliolink,
  About,
};
