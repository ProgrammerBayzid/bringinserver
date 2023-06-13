const express = require("express");
const app = express();

const {
  Workexperience,
  Education,
  Skill,
  Protfoliolink,
  About,
} = require("../../Model/profiledeteles");
const tokenverify = require("../../MiddleWare/tokenverify.js");
const jwt = require("jsonwebtoken");


// education api

app.post("/education", async (req, res) => {
  try {
    const educationdata = new Education(req.body);
    const education = await educationdata.save();
    res.status(201).send(education);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/education/:id", async (req, res) => {
  try {
    const id = req.params.body;
    const singleeducationdata = await Education.findById(id);
    res.send(singleeducationdata);
  } catch (error) {
    res.send(error);
  }
});

app.delete("/education/:id", async (req, res) => {
  try {
    const deleteData = await Education.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      return res.status(400).send();
    }
    res.send(deleteData);
  } catch (error) {
    res.send(error);
  }
});

app.patch("/education", async (req, res) => {
  try {
    const _id = req.params.id;
    const updateEducation = await Education.findByIdAndUpdate(
      _id,
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
  } catch (error) {
    res.status(404).send(error);
  }
});

// work exprience api

app.post("/workexperience", async (req, res) => {
  try {
    const workexperiencedata = new Workexperience(req.body);
    const workexperience = await workexperiencedata.save();
    res.status(201).send(workexperience);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/workexperience/:id", async (req, res) => {
  try {
    const id = req.params.body;
    const singleworkexperiencedata = await Workexperience.findById(id);
    res.send(singleworkexperiencedata);
  } catch (error) {
    res.send(error);
  }
});

app.delete("/workexperience/:id", async (req, res) => {
  try {
    const deleteData = await Workexperience.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      return res.status(400).send();
    }
    res.send(deleteData);
  } catch (error) {
    res.send(error);
  }
});

app.patch("/workexperience", async (req, res) => {
  try {
    const _id = req.params.id;
    const updateWorkexperience = await Workexperience.findByIdAndUpdate(
      _id,
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
  } catch (error) {
    res.status(404).send(error);
  }
});

// skill api

app.post("/skill", async (req, res) => {
  try {
    const skilldata = new Skill(req.body);
    const skill = await skilldata.save();
    res.status(201).send(skill);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/skill/:id", async (req, res) => {
  try {
    const id = req.params.body;
    const singleskilldata = await Skill.findById(id);
    res.send(singleskilldata);
  } catch (error) {
    res.send(error);
  }
});

app.delete("/skill/:id", async (req, res) => {
  try {
    const deleteData = await Skill.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      return res.status(400).send();
    }
    res.send(deleteData);
  } catch (error) {
    res.send(error);
  }
});
app.patch("/skill", async (req, res) => {
  try {
    const _id = req.params.id;
    const updateskill = await Skill.findByIdAndUpdate(
      _id,
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
  } catch (error) {
    res.status(404).send(error);
  }
});

// protfolio api

app.post("/protfolio", async (req, res) => {
  try {
    const protfoliodata = new Protfoliolink(req.body);
    const protfolio = await protfoliodata.save();
    res.status(201).send(protfolio);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/protfolio/:id", async (req, res) => {
  try {
    const id = req.params.body;
    const singleprotfoliodata = await Protfoliolink.findById(id);
    res.send(singleprotfoliodata);
  } catch (error) {
    res.send(error);
  }
});

app.delete("/protfolio/:id", async (req, res) => {
  try {
    const deleteData = await Protfoliolink.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      return res.status(400).send();
    }
    res.send(deleteData);
  } catch (error) {
    res.send(error);
  }
});
app.patch("/protfolio", async (req, res) => {
  try {
    const _id = req.params.id;
    const updateprotfolio = await Protfoliolink.findByIdAndUpdate(
      _id,
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
  } catch (error) {
    res.status(404).send(error);
  }
});

// about api

app.post("/about", async (req, res) => {
  try {
    const aboutdata = new About({
      workid: req.body.workid,
      educationid: req.body.education,
      skillid: req.body.skill,
      Protfolioid: req.body.Protfolio,
      about: req.body.about,
    });
    const siabout = await aboutdata.save();
    res.status(201).send(siabout);
  } catch (error) {
    res.status(400).send(error);
  }
});


app.get("/about/:id", async (req, res) => {
  try {
    const id = req.params.body;
    const singleaboutdata = await About.findById(id);
    res.send(singleaboutdata);
  } catch (error) {
    res.send(error);
  }
});

app.delete("/protfolio/:id", async (req, res) => {
  try {
    const deleteData = await About.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      return res.status(400).send();
    }
    res.send(deleteData);
  } catch (error) {
    res.send(error);
  }
});
app.patch("/protfolio", async (req, res) => {
  try {
    const _id = req.params.id;
    const updateabout = await About.findByIdAndUpdate(
      _id,
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
  } catch (error) {
    res.status(404).send(error);
  }
});

module.exports = app;

