const express = require("express");
const app = express();

const { Workexperience } = require("../../Model/workexperience");

app.post("/workexperience", async (req, res) => {
  try {
    const workexperiencedata = new Workexperience(req.body);
    const workexperience = await workexperiencedata.save();
    res.status(201).send(workexperience);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/workexperience/:id", async (req, res) => {
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

module.exports = app;
