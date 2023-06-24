const express = require("express");
const app = express();

const {
  Expertisearea,
  Category,
  Functionarea,
} = require("../../Model/industry.js");
const { City, Division } = require("../../Model/alllocation.js");
const { Jobtype } = require("../../Model/jobtype.js");
const { Salirietype } = require("../../Model/salarie.js");
const {} = require("../../Model/Seeker_profile_all_details.js");
const {
  EducationLavel,
  Digree,
  Subject,
} = require("../../Model/education_lavel.js");

// industry add

// industry list

app.get("/admin/industry", async (req, res) => {
  try {
    var industrydata = await Expertisearea.find().populate("category");
    res.status(200).json(industrydata);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete("/admin/industry/:id", async (req, res) => {
  try {
    const result = await Expertisearea.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      return res.status(404).send();
    }
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

//category get

app.get("/admin/category", async (req, res) => {
  try {
    var data = await Category.find().populate(["industryid", "functionarea"]);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete("/admin/category/:id", async (req, res) => {
  try {
    const result = await Category.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      return res.status(404).send();
    }
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

// functional area add

app.get("/admin/functionalarea", async (req, res) => {
  try {
    var data = await Functionarea.find().populate(["industryid", "categoryid"]);
    res.json(data);
  } catch (error) {
    res.send(error);
  }
});

app.delete("/admin/functionalarea/:id", async (req, res) => {
  try {
    const result = await Functionarea.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      return res.status(404).send();
    }
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

// functionalarea add

app.get("/admin/functionalarea", async (req, res) => {
  try {
    var data = await Functionarea.find().populate(["industryid", "categoryid"]);
    res.json(data);
  } catch (error) {
    res.send(error);
  }
});

app.delete("/admin/functionalarea/:id", async (req, res) => {
  try {
    const result = await Functionarea.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      return res.status(404).send();
    }
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

// location

app.get("/admin/location", async (req, res) => {
  try {
    var data = await City.find().populate("divisionid");
    res.json(data);
  } catch (error) {
    res.send(error);
  }
});

app.delete("/admin/location/:id", async (req, res) => {
  try {
    const result = await City.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      return res.status(404).send();
    }
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});



// # post salarietype
app.get("/admin/salarie", async (req, res) => {
  try {
    var data = await Salirietype.find();
    res.json(data);
  } catch (error) {
    res.send(error);
  }
});

app.delete("/admin/salarie/:id", async (req, res) => {
  try {
    const result = await Salirietype.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      return res.status(404).send();
    }
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});




// # get jobtype data

app.get("/admin/jobtype", async (req, res) => {
  try {
    const jobtypeData = await Jobtype.find();
    res.send(jobtypeData);
  } catch (error) {
    res.send(error);
  }
});
app.delete("/admin/jobtype/:id", async (req, res) => {
  try {
    const result = await Jobtype.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      return res.status(404).send();
    }
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});




app.get("/admin/digree", async (req, res) => {
  try {
    const Data = await Digree.find().populate(["education","subject"]);
    res.send(Data);
  } catch (error) {
    res.send(error);
  }
});

app.delete("/admin/digree/:id", async (req, res) => {
  try {
    const result = await Digree.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      return res.status(404).send();
    }
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});


app.delete("/admin/education_lavel/:id", async (req, res) => {
  try {
    const result = await EducationLavel.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      return res.status(404).send();
    }
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});


app.get("/admin/subject", async (req, res) => {
  try {
    const Data = await Subject.find().populate(["educaton","digree"]);
    res.send(Data);
  } catch (error) {
    res.send(error);
  }
});

app.delete("/admin/subject/:id", async (req, res) => {
  try {
    const result = await Subject.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      return res.status(404).send();
    }
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

















module.exports = app;
