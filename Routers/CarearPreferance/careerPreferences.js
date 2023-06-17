const express = require("express");
const app = express();

const tokenverify = require("../../MiddleWare/tokenverify.js");
const jwt = require("jsonwebtoken");
const {
  Expertisearea,
  Category,
  Functionarea,
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
        industryid: req.body.industryid,
        categoryid: req.body.categoryid,
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
    var data = await Functionarea.find().populate(["industryid","categoryid" ]);
    res.json(data);
  } catch (error) {
    res.send(error);
  }
});

module.exports = app;
