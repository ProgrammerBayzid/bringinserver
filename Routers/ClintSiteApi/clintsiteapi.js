const express = require("express");
const app = express();

const {
  Expertisearea,
  Category,
  Functionarea,
} = require("../../Model/industry.js");
const { Profiledata } = require("../../Model/Seeker_profile_all_details.js");
const Recruiters = require("../../Model/Recruiter/recruiters");
const tokenverify = require("../../MiddleWare/tokenverify.js");
const jwt = require("jsonwebtoken");

const { City, Division } = require("../../Model/alllocation.js");

const Experince = require("../../Model/experience.js");

app.get("/job_functionalarea/clint", async (req, res) => {
  try {
    var industry = await Expertisearea.find().populate([
      { path: "category", populate: { path: "functionarea" } },
    ]);
    res.status(200).send(industry);
  } catch (error) {
    res.status(404).send(error);
  }
});

app.get("/job_functionalarea/:_id", async (req, res) => {
  try {
    var industry = await Expertisearea.findById(req.params._id).populate([
      { path: "category", populate: { path: "functionarea" } },
    ]);
    res.status(200).send(industry);
  } catch (error) {
    res.status(404).send(error);
  }
});

app.get("/expertisearea/:_id", async (req, res) => {
  try {
    var data = await Category.findById(req.params._id).populate([
      "industryid",
      "functionarea",
    ]);
    res.status(200).json(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/functionalarea/:_id", async (req, res) => {
  try {
    var data = await Functionarea.findById(req.params._id).populate([
      "industryid",
      "categoryid",
    ]);
    res.json(data);
  } catch (error) {
    res.send(error);
  }
});
app.get("/single_profile/:_id", async (req, res) => {
  try {
    var populate = [
      {
        path: "workexperience",
        populate: [
          { path: "category", select: "-functionarea" },
          "expertisearea",
        ],
      },
      {
        path: "education",
        populate: [
          {
            path: "digree",
            select: "-subject",
            populate: { path: "education", select: "-digree" },
          },
          "subject",
        ],
      },
      "skill",
      "protfoliolink",
      "about",
      {
        path: "careerPreference",
        populate: [
          { path: "category", select: "-functionarea" },
          { path: "functionalarea" },
          {
            path: "division",
            populate: { path: "cityid", select: "-divisionid" },
          },
          "jobtype",
          "salaray",
        ],
      },
      { path: "userid", populate: { path: "experiencedlevel" } },
    ];
    var data = await Profiledata.findById(req.params._id).populate(populate);
    res.json(data);
  } catch (error) {
    res.send(error);
  }
});

app.get("/candidatelist_clint", async (req, res) => {
  try {
    function industryfilter(element) {
      if (element.functionalarea._id == req.query.functionalareaid) {
        return true;
      } else {
        return false;
      }
    }

    if (req.query.functionalareaid == 0) {
      var jobdata = await JobPost.find()
        .select(["expertice_area", "company"])
        .populate([
          { path: "company", select: "c_location" },
          "expertice_area",
        ]);
      let functionarea = [];
      let cityname = [];
      let functionalregex;
      let cityregex;
      for (let index = 0; index < jobdata.length; index++) {
        functionarea.push(jobdata[index].expertice_area.functionalname);
        cityname.push(jobdata[index].company.c_location.formet_address);
      }
      functionalregex = functionarea.join("|");
      cityregex = cityname.join("|");
      var populate = [
        {
          path: "workexperience",
          populate: [
            { path: "category", select: "-functionarea" },
            "expertisearea",
          ],
        },
        {
          path: "education",
          populate: [
            {
              path: "digree",
              select: "-subject",
              populate: { path: "education", select: "-digree" },
            },
            "subject",
          ],
        },
        "skill",
        "protfoliolink",
        "about",
        {
          path: "careerPreference",
          populate: [
            { path: "category", select: "-functionarea" },
            { path: "functionalarea" },
            {
              path: "division",
              populate: { path: "cityid", select: "-divisionid" },
            },
            "jobtype",
            "salaray",
          ],
        },
        { path: "userid", populate: { path: "experiencedlevel" } },
      ];

      var seekerdata = await Profiledata.find().populate(populate);
      res.status(200).send(seekerdata);
    } else {
      var populate2 = [
        {
          path: "workexperience",
          populate: [
            { path: "category", select: "-functionarea" },
            "expertisearea",
          ],
        },
        {
          path: "education",
          populate: [
            {
              path: "digree",
              select: "-subject",
              populate: { path: "education", select: "-digree" },
            },
            "subject",
          ],
        },
        "skill",
        "protfoliolink",
        "about",
        {
          path: "careerPreference",
          populate: [
            { path: "category", select: "-functionarea" },
            { path: "functionalarea" },
            {
              path: "division",
              populate: { path: "cityid", select: "-divisionid" },
            },
            "jobtype",
            "salaray",
          ],
        },
        { path: "userid", populate: { path: "experiencedlevel" } },
      ];
      var seekerdata = await Profiledata.find()
        .populate(populate2)
        .then((data) =>
          data.filter((filterdata) => {
            var filterdata2 =
              filterdata.careerPreference.filter(industryfilter);
            if (filterdata2.length > 0) {
              return true;
            } else {
              return false;
            }
          })
        );
      res.status(200).send(seekerdata);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = app;