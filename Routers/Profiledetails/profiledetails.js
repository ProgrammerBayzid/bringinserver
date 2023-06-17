const express = require("express");
const app = express();

const {
  Workexperience,
  Education,
  Skill,
  Protfoliolink,
  About,
  CareerPreference,
  Profiledata,
} = require("../../Model/profiledetails.js");

const tokenverify = require("../../MiddleWare/tokenverify.js");
const jwt = require("jsonwebtoken");

// education api

app.post("/education", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const educationdata = await Education({
          institutename: req.body.institutename,
          educationallevel: req.body.educationallevel,
          subject: req.body.subject,
          grade: req.body.grade,
          starttoend: req.body.starttoend,
          userid: _id,
        });
        const education = await educationdata.save();
        const educationid = Education.findById(_id);
        const dataid = educationid._conditions._id;
        const id = await Profiledata({ educationid: dataid });
        const alleducationdata = await id.save();
        console.log(dataid);
        res.status(201).send(education);
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/education/:_id", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const singleeducationdata = await Education.find({ userid: _id });
        res.send(singleeducationdata);
      }
    });
  } catch (error) {
    res.send(error);
  }
});

app.delete("/education/:_id", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const user = authdata._id;
        const _id = { userid: user };
        const deleteData = await Education.findOneAndDelete(_id);
        if (!_id) {
          return res.status(400).send();
        }
        res.send(deleteData);
      }
    });
  } catch (error) {
    res.send(error);
  }
});

app.patch("/education/:_id", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const updateEducation = await Education.findOneAndUpdate(
          { userid: _id },
          {
            $set: {
              institutename: req.body.institutename,
              educationallevel: req.body.educationallevel,
              subject: req.body.subject,
              grade: req.body.grade,
              starttoend: req.body.starttoend,
            },
          },
          {
            new: true,
          }
        );

        res.send(updateEducation);
      }
    });
  } catch (error) {
    res.status(404).send(error);
  }
});

// work exprience api

app.post("/workexperience", tokenverify, async (req, res) => {
  jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
    if (err) {
      res.json({ message: "invalid token" });
    } else {
      const _id = authdata._id;
      const workexperiencedata = await Workexperience({
        companyname: req.body.companyname,
        industryname: req.body.industryname,
        starttoend: req.body.starttoend,
        expertisearea: req.body.expertisearea,
        designation: req.body.designation,
        department: req.body.department,
        dutiesandresponsibilities: req.body.dutiesandresponsibilities,
        careermilestones: req.body.careermilestones,
        userid: _id,
      });
      const workexperience = await workexperiencedata.save();
      const workexperienceid = Workexperience.findById(_id);
      const dataid = workexperienceid._conditions._id;
      const id = await Profiledata({ workexperienceid: dataid });
      const allworkexperiencedata = await id.save();
      console.log(dataid);
      res.status(200).send(workexperience);
    }
  });
});

app.get("/workexperience/:_id", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const singleworkexperiencedata = await Workexperience.find({
          userid: _id,
        });
        res.send(singleworkexperiencedata);
      }
    });
  } catch (error) {
    res.send(error);
  }
});

app.delete("/workexperience/:_id", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const user = authdata._id;
        const _id = { userid: user };
        const deleteData = await Workexperience.findOneAndDelete(_id);
        if (!_id) {
          return res.status(400).send();
        }
        res.send(deleteData);
      }
    });
  } catch (error) {
    res.send(error);
  }
});

app.patch("/workexperience/:_id", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const updateWorkexperience = await Workexperience.findOneAndUpdate(
          { userid: _id },
          {
            $set: {
              companyname: req.body.companyname,
              industry: req.body.industry,
              starttoend: req.body.starttoend,
              expertisearea: req.body.expertisearea,
              designation: req.body.designation,
              department: req.body.department,
              dutiesandresponsibilities: req.body.dutiesandresponsibilities,
              careermilestones: req.body.careermilestones,
            },
          },
          {
            new: true,
          }
        );

        res.send(updateWorkexperience);
      }
    });
  } catch (error) {
    res.status(404).send(error);
  }
});

// skill api

app.post("/skill", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const skilldata = await Skill({
          skillname: req.body.skillname,
          userid: _id,
        });
        const skill = await skilldata.save();

        const skillid = Skill.findById(_id);
        // console.log(skillid);
        const dataid = skillid.schema.paths._id;
        // const id = await Profiledata(dataid);
        // const allskilldata = await id.save();
        console.log(dataid);
        res.status(200).send(skill);
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/skill/:_id", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const singleskilldata = await Skill.find({ userid: _id });
        res.send(singleskilldata);
      }
    });
  } catch (error) {
    res.send(error);
  }
});

app.delete("/skill/:_id", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const user = authdata._id;
        const _id = { userid: user };
        const deleteData = await Skill.findOneAndDelete(_id);
        if (!_id) {
          return res.status(400).send();
        }
        res.send(deleteData);
      }
    });
  } catch (error) {
    res.send(error);
  }
});
app.patch("/skill/:_id", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const updateskill = await Skill.findOneAndUpdate(
          { userid: _id },
          {
            $set: {
              skillname: req.body.skillname,
            },
          },
          {
            new: true,
          }
        );

        res.send(updateskill);
      }
    });
  } catch (error) {
    res.status(404).send(error);
  }
});

// protfolio api

app.post("/protfolio", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const protfoliodata = await Protfoliolink({
          protfoliolink: req.body.protfoliolink,
          userid: _id,
        });
        const protfolio = await protfoliodata.save();
        const protfoliolink = Protfoliolink.findById(_id);
        const dataid = protfoliolink._conditions._id;
        const protfolioid = await Profiledata({ protfoliolinkid: dataid });
        const allProfiledata = await protfolioid.save();
        console.log(dataid);
        res.status(200).send(protfolio);
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/protfolio/:_id", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const singleprotfoliodata = await Protfoliolink.find({ userid: _id });
        res.send(singleprotfoliodata);
      }
    });
  } catch (error) {
    res.send(error);
  }
});

app.delete("/protfolio/:_id", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const user = authdata._id;
        const _id = { userid: user };
        const deleteData = await Protfoliolink.findOneAndDelete(_id);
        if (!_id) {
          return res.status(400).send();
        }
        res.send(deleteData);
      }
    });
  } catch (error) {
    res.send(error);
  }
});
app.patch("/protfolio/:_id", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const updateprotfolio = await Protfoliolink.findOneAndUpdate(
          { userid: _id },
          {
            $set: {
              protfoliolink: req.body.protfoliolink,
            },
          },
          {
            new: true,
          }
        );

        res.send(updateprotfolio);
      }
    });
  } catch (error) {
    res.status(404).send(error);
  }
});

// about api

app.post("/about", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const aboutdata = await About({
          about: req.body.about,
          userid: _id,
        });
        const siabout = await aboutdata.save();
        const aboutid = About.findById(_id);
        const dataid = aboutid._conditions._id;
        const id = await Profiledata({ aboutid: dataid });
        const allaboutdata = await id.save();
        console.log(dataid);
        res.status(200).send(siabout);
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/about/:_id", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const singleaboutdata = await About.find({ userid: _id });
        res.status(200).send(singleaboutdata);
      }
    });
  } catch (error) {
    res.send(error);
  }
});

app.delete("/about/:_id", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const user = authdata._id;
        const _id = { userid: user };
        const deleteData = await About.findOneAndDelete(_id);
        if (!_id) {
          return res.status(400).send();
        }
        res.send(deleteData);
      }
    });
  } catch (error) {
    res.send(error);
  }
});
app.patch("/about/:_id", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const updateabout = await About.findOneAndUpdate(
          { userid: _id },
          {
            $set: {
              about: req.body.about,
            },
          },
          {
            new: true,
          }
        );

        res.send(updateabout);
      }
    });
  } catch (error) {
    res.status(404).send(error);
  }
});

// careerpreference api

app.post("/careerpreference", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const careerpreferencedata = await CareerPreference({
          expectedjobindustry: req.body.expectedjobindustry,
          expertisearea: req.body.expertisearea,
          expectedjoblocation: req.body.expectedjoblocation,
          jobtype: req.body.jobtype,
          expectedsalary: req.body.expectedsalary,
          userid: _id,
        });
        const careerpreference = await careerpreferencedata.save();
        const careerpreferenceid = CareerPreference.findById(_id);
        const dataid = careerpreferenceid._conditions._id;
        const id = await Profiledata({ careerPreferenceid: dataid });
        const allcareerpreferencedata = await id.save();
        console.log(dataid);
        res.status(201).send(careerpreference);
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/careerpreference/:_id", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const singleCareerPreferencedata = await CareerPreference.find({
          userid: _id,
        });
        res.send(singleCareerPreferencedata);
      }
    });
  } catch (error) {
    res.send(error);
  }
});

app.delete("/careerpreference/:_id", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const user = authdata._id;
        const _id = { userid: user };
        const deleteData = await CareerPreference.findOneAndDelete(_id);
        if (!_id) {
          return res.status(400).send();
        }
        res.send(deleteData);
      }
    });
  } catch (error) {
    res.send(error);
  }
});

app.patch("/careerpreference/:_id", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const update = await CareerPreference.findOneAndUpdate(
          { userid: _id },
          {
            $set: {
              expectedjobindustry: req.body.expectedjobindustry,
              expertisearea: req.body.expertisearea,
              expectedjoblocation: req.body.expectedjoblocation,
              jobtype: req.body.jobtype,
              expectedsalary: req.body.expectedsalary,
            },
          },
          {
            new: true,
          }
        );

        res.send(update);
      }
    });
  } catch (error) {
    res.status(404).send(error);
  }
});

// get profile data

app.get("/profiledetails", async (req, res) => {
  try {
    var data = await Profiledata.find().populate(
      [
        "workexperience",
        "education",
        "skill",
        "protfoliolink",
        "about",
        "careerPreference"
      ]
    );
    res.json(data);
  } catch (error) {
    res.send(error);
  }
});

module.exports = app;
