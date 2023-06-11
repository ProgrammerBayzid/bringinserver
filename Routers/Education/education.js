const express = require("express");
const app = express();

const { Education } = require("../../Model/education");

app.post("/education", async (req, res) => {
  try {
    const educationdata = new Education(req.body);
    const education = await educationdata.save();
    res.status(201).send(education);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/education/:id", async (req, res) => {
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

module.exports = app;
