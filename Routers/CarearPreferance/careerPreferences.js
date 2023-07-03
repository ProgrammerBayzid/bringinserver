const express = require("express");
const app = express();
const tokenverify = require("../../MiddleWare/tokenverify.js");
const jwt = require("jsonwebtoken");
const {
  Expertisearea,
  Category,
  Functionarea,
} = require("../../Model/industry.js");
const { City, Division } = require("../../Model/alllocation.js");
const { Jobtype } = require("../../Model/jobtype");
const { Salirietype } = require("../../Model/salarie");
const Career_preferences = require("../../Model/career_preferences.js");
const Seekerprofile = require("../../Model/userModel.js")
const {
  Workexperience,
  Education,
  Skill,
  Protfoliolink,
  About,
  CareerPreference,
  Profiledata,
} = require("../../Model/Seeker_profile_all_details.js");


// industry list









app.get("/industry", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        console.log(authdata);
        const _id = authdata._id;
        var industrydata = await Expertisearea.find();
        res.status(200).json(industrydata);
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

//category add




// functional area add





// location add



// job type

// # post jobtype data


// # post salarietype







// # gett salarietype
app.get("/salarietype", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const salirieData = await Salirietype.find();
        res.send(salirieData);
      }
    });
  } catch (error) {
    res.send(error);
  }
});




// job industry list

app.get("/job_industrylist", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        var categorydata = await Category.find().select("-functionarea");
        var industry = await Expertisearea.find().populate([
          { path: "category", select: "-functionarea" },
        ]);
        // .populate(["category"]);
        res.status(200).json({
          category: categorydata,
          industry: industry,
        });
      }
    });
  } catch (error) {
    res.status(404).send(error);
  }
});

app.get("/job_functionalarea", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        var industry = await Expertisearea.find().populate([
          { path: "category", populate: { path: "functionarea" } },
        ]);
        res.status(200).send(industry);
      }
    });
  } catch (error) {
    res.status(404).send(error);
  }
});

app.get("/location", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        var citydata = await City.find().populate({
          path: "divisionid",
          select: "-cityid",
        });
        res.status(200).send(citydata);
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// # get jobtype data

app.get("/jobtype", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const jobtypeData = await Jobtype.find();
        res.send(jobtypeData);
      }
    });
  } catch (error) {
    res.send(error);
  }
});




// carear preferance add

app.post("/career_preferences", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        var id = authdata._id;
        var data = await Career_preferences.findOne({
          userid: id,
          functionalarea: req.body.functionalarea,
        });
        if (data == null) {
          var carearpre = await Career_preferences({
            userid: id,
            category: req.body.category,
            functionalarea: req.body.functionalarea,
            division: req.body.division,
            jobtype: req.body.jobtype,
            salaray: req.body.salaray,
          });
          carearpre.save();
          var profiledata = await Profiledata.findOneAndUpdate(
            { userid: id },
            { $push: { careerPreference: carearpre._id } }
          );
          if (profiledata == null) {
            await Profiledata({
              userid: id,
              careerPreference: carearpre._id,
            }).save();
          }
          await Seekerprofile.findOneAndUpdate({_id: id}, {$inc: { carearpre: 1} })
          res.status(200).json({ message: "add successfull" });
        } else {
          res.status(400).json({ message: "allready added" });
        }
      }
    });
  } catch (error) {
    res.send(error);
  }
});

app.post("/career_preferences_update", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        var id = authdata._id;
        var data = await Career_preferences.findOneAndUpdate(
          { userid: id, _id: req.query.id },
          {
            $set: {
              category: req.body.category,
              functionalarea: req.body.functionalarea,
              division: req.body.division,
              jobtype: req.body.jobtype,
              salaray: req.body.salaray,
            },
          }
        );
        if (data == null) {
          res.status(400).json({ message: "iteam not found" });
        } else {
          // var profiledata = await Profiledata.findOneAndUpdate({ userid: id }, {$pull: { "careerPreference": data._id }})
          // if (profiledata == null) {
          //   await Profiledata({
          //     userid: id,
          //     careerPreference: data._id
          //   }).save()
          // }
          res.status(200).json({ message: "Update Sucessfull" });
        }
      }
    });
  } catch (error) {
    res.send(error);
  }
});

app.get("/career_preferences", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        var id = authdata._id;
        var data = await Career_preferences.find({ userid: id }).populate([
          { path: "category", select: "-functionarea" },
          "functionalarea",
          {
            path: "division",
            populate: { path: "cityid", select: "-divisionid" },
          },
          "jobtype",
          "salaray",
        ]);
        res.status(200).send(data);
      }
    });
  } catch (error) {
    res.send(error);
  }
});

app.delete("/career_preferences_delete", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        var id = authdata._id;
        var data = await Career_preferences.findOneAndDelete({
          userid: id,
          _id: req.query.id,
        });
        if (data == null) {
          res.status(400).json({ message: "iteam not found" });
        } else {
          await Profiledata.findOneAndUpdate(
            { userid: id },
            { $pull: { careerPreference: data._id } }
          );
          res.status(200).json({ message: "Delete Sucessfull" });
        }
      }
    });
  } catch (error) {
    res.send(error);
  }
});

module.exports = app;
