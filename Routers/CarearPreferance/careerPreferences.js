const express = require("express");
const app = express();

const tokenverify = require("../../MiddleWare/tokenverify.js");
const jwt = require("jsonwebtoken");
const {
  Expertisearea,
  Category,
  Functionarea,
  Addjobtype,
  Addsalarietype,
} = require("../../Model/industry.js");

// industry add
app.post("/industryadd", async (req, res) => {
  try {
    var industrydata = await Expertisearea.findOne({
      industryname: req.body.industryname,
    });
    if (industrydata == null) {
      await Expertisearea({ industryname: req.body.industryname }).save();
      res.json({ message: "industry add successfull" });
    } else {
      res.json({ message: "industry already added" });
    }
  } catch (error) {
    res.send(error);
  }
});

// job type add
app.post("/jobtypeadd", async (req, res) => {
  try {
    var jobtypedata = await Addjobtype.findOne({ jobtype: req.body.jobtype });
    if (jobtypedata == null) {
      await Addjobtype({ jobtype: req.body.jobtype }).save();
      res.json({ message: "jobtype add successfull" });
    } else {
      res.json({ message: "jobtype already added" });
    }
  } catch (error) {
    res.send(error);
  }
});

// salarie type add

app.post("/salarietypeadd", async (req, res) => {
  try {
    var salarietypedata = await Addsalarietype.findOne({
      salarietype: req.body.salarietype,
    });
    if (salarietypedata == null) {
      await Addsalarietype({ salarietype: req.body.salarietype }).save();
      res.json({ message: "salarie add successfull" });
    } else {
      res.json({ message: "salarie already added" });
    }
  } catch (error) {
    res.send(error);
  }
});

//category add

app.post("/categoryadd", async (req, res) => {
  try {
    var categorydata = await Category.findOne({
      categoryname: req.body.categoryname,
    });
    if (categorydata == null) {
      await Category({
        categoryname: req.body.categoryname,
        industryid: req.body.industryid,
      }).save();
      res.json({ message: "Categor add successfull" });
    } else {
      res.json({ message: "Category already added" });
    }
  } catch (error) {
    res.send(error);
  }
});

app.get("/categorylist", async (req, res) => {
  try {
    var categorydata = await Category.find().populate("industryid");
    res.json(categorydata);
  } catch (error) {
    res.send(error);
  }
});

// functional area add

app.post("/functionalareaadd", async (req, res) => {
  try {
    var functionaldata = await Functionarea.findOne({
      functionalname: req.body.functionalname,
    });
    if (functionaldata == null) {
      await Functionarea({
        categoryid: req.body.categoryid,
        industryid: req.body.industryid,
        jobetypeid: req.body.jobetypeid,
        salarietypeid: req.body.salarietypeid,
        functionalname: req.body.functionalname,
      }).save();
      res.json({ message: "Functional Area add successfull" });
    } else {
      res.json({ message: "Functional Area already added" });
    }
  } catch (error) {
    res.send(error);
  }
});

app.get("/functionalarea", async (req, res) => {
  try {
    var Functionarea = await Functionarea.find().populate("industryid");
    res.json(Functionarea);
  } catch (error) {
    res.send(error);
  }
});



app.delete("/functionalarea/:id", async (req, res) => {
  try {
    const deleteData = await Functionarea.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      return res.status(400).send();
    }
    res.send(deleteData);
  } catch (error) {
    res.send(error);
  }
});

module.exports = app;
