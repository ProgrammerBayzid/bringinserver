const express = require("express");
const app = express();

const {Functionarea} = require("../../Model/industry")

const {
  Workexperience,
  Education,
  DefaultSkill,
  Skill,
  Protfoliolink,
  About,
  CareerPreference,
  Profiledata,
} = require("../../Model/Seeker_profile_all_details.js");
const Seekeruser = require("../../Model/userModel.js");

const tokenverify = require("../../MiddleWare/tokenverify.js");
const jwt = require("jsonwebtoken");

// about api

app.post("/about", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const aboutdata = await About.findOneAndUpdate(
          { userid: _id },
          { $set: { about: req.body.about } }
        );
        if (aboutdata == null) {
          const about = await About({
            about: req.body.about,
            userid: _id,
          });
          await about.save();
          console.log(about._id);
          var profiledata = await Profiledata.findOneAndUpdate(
            { userid: _id },
            { $set: { about: about._id } }
          );

          if (profiledata == null) {
            await Profiledata({
              userid: _id,
              aboutid: about._id,
            }).save();
          }
          await Seekeruser.findOneAndUpdate(
            { _id: _id },
            { $inc: { "other.incomplete": -1, "other.complete": 1 } }
          );
          res.status(200).json({ message: "add successfull" });
        } else {
          console.log(aboutdata._id);
          var profiledata = await Profiledata.findOneAndUpdate(
            { userid: _id },
            { $set: { about: aboutdata._id } }
          );
          if (profiledata == null) {
            await Profiledata({
              userid: _id,
              about: aboutdata._id,
            }).save();
          }
          res.status(200).json({ message: "update successfull" });
        }
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// work exprience api

app.post("/workexperience", tokenverify, async (req, res) => {
  jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
    if (err) {
      res.json({ message: "invalid token" });
    } else {
      const _id = authdata._id;

      var workdata = await Workexperience.findOne({
        userid: _id,
        companyname: req.body.companyname,
      });

      if (workdata == null) {
        const workexperiencedata = await Workexperience({
          companyname: req.body.companyname,
          category: req.body.category,
          startdate: req.body.startdate,
          enddate: req.body.enddate,
          expertisearea: req.body.expertisearea,
          designation: req.body.designation,
          department: req.body.department,
          dutiesandresponsibilities: req.body.dutiesandresponsibilities,
          careermilestones: req.body.careermilestones,
          workintern: req.body.workintern,
          hidedetails: req.body.hidedetails,
          userid: _id,
        });
        await workexperiencedata.save();
        var profiledata = await Profiledata.findOneAndUpdate(
          { userid: _id },
          { $push: { workexperience: workexperiencedata._id } }
        );
        if (profiledata == null) {
          await Profiledata({
            userid: _id,
            aboutid: workexperiencedata._id,
          }).save();
          await Seekeruser.findOneAndUpdate(
            { _id: _id },
            { $inc: { "other.incomplete": -1, "other.complete": 1 } }
          );
        } else {
          if (profiledata.workexperience.length == 0) {
            await Seekeruser.findOneAndUpdate(
              { _id: _id },
              { $inc: { "other.incomplete": -1, "other.complete": 1 } }
            );
          }
        }

        res.status(200).json({ message: "Add Successfull" });
      } else {
        res.status(400).json({ message: "All ready Added" });
      }
    }
  });
});

app.get("/workexperience", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const workexperiencedata = await Workexperience.find({
          userid: _id,
        }).populate(["category", "expertisearea"]);
        res.send(workexperiencedata);
      }
    });
  } catch (error) {
    res.send(error);
  }
});

app.delete("/workexperience", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const user = authdata._id;
        var data = await Workexperience.findOneAndDelete({
          userid: user,
          _id: req.query.id,
        });
        //  await Profiledata.findOneAndUpdate({ userid: user }, { $pull: { "workexperience": req.query.id } })

        if (data == null) {
          res.status(400).json({ message: "iteam not found" });
        } else {
          await Profiledata.findOneAndUpdate(
            { userid: user },
            { $pull: { workexperience: req.query.id } }
          );
          var workdata = await Workexperience.find({ userid: user });
          if (workdata.length == 0) {
            await Seekeruser.findOneAndUpdate(
              { _id: user },
              { $inc: { "other.incomplete": 1, "other.complete": -1 } }
            );
          }
          res.status(200).json({ message: "delete successfull" });
        }
      }
    });
  } catch (error) {
    res.send(error);
  }
});

app.post("/workexperience_update", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        await Workexperience.findOneAndUpdate(
          { userid: _id, _id: req.query.id },
          {
            $set: {
              companyname: req.body.companyname,
              category: req.body.category,
              startdate: req.body.startdate,
              enddate: req.body.enddate,
              expertisearea: req.body.expertisearea,
              designation: req.body.designation,
              department: req.body.department,
              dutiesandresponsibilities: req.body.dutiesandresponsibilities,
              careermilestones: req.body.careermilestones,
              workintern: req.body.workintern,
              hidedetails: req.body.hidedetails,
            },
          },
          {
            new: true,
          }
        );

        res.status(200).json({ message: "update successfull" });
      }
    });
  } catch (error) {
    res.status(404).send(error);
  }
});

// education api

app.post("/education", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;

        const edudata = await Education.findOne({
          userid: _id,
          digree: req.body.digree,
        });
        if (edudata == null) {
          const educationdata = await Education({
            institutename: req.body.institutename,
            digree: req.body.digree,
            subject: req.body.subject,
            grade: req.body.grade,
            startdate: req.body.startdate,
            enddate: req.body.enddate,
            type: req.body.type,
            grade: req.body.grade,
            gradetype: req.body.type == 1 ? req.body.gradetype : "Division",
            division: String,
            otheractivity: req.body.otheractivity,
            userid: _id,
          });
          educationdata.save();
          var profiledata = await Profiledata.findOneAndUpdate(
            { userid: _id },
            { $push: { education: educationdata._id } }
          );
          if (profiledata == null) {
            await Profiledata({
              userid: _id,
              education: educationdata._id,
            }).save();
            await Seekeruser.findOneAndUpdate(
              { _id: _id },
              { $inc: { "other.incomplete": -1, "other.complete": 1 } }
            );
          } else {
            if (profiledata.education.length == 0) {
              await Seekeruser.findOneAndUpdate(
                { _id: _id },
                { $inc: { "other.incomplete": -1, "other.complete": 1 } }
              );
            }
          }

          res.status(200).json({ message: "Education Add Successfull" });
        } else {
          res.status(400).json({ message: "already added" });
        }
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/education", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const singleeducationdata = await Education.find({
          userid: _id,
        }).populate([{ path: "digree", select: "-subject" }, "subject"]);
        res.status(200).send(singleeducationdata);
      }
    });
  } catch (error) {
    res.send(error);
  }
});

app.delete("/education", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;

        await Education.findOneAndDelete({ _id: req.query.id });
        await Profiledata.findOneAndUpdate(
          { userid: _id },
          { $pull: { education: req.query.id } }
        );
        var edudata = await Education.find({ userid: _id });
        if (edudata.length == 0) {
          await Seekeruser.findOneAndUpdate(
            { _id: _id },
            { $inc: { "other.incomplete": 1, "other.complete": -1 } }
          );
        }

        res.status(200).json({ message: "Delete Successfull" });
      }
    });
  } catch (error) {
    res.send(error);
  }
});

app.post("/education_update", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const updateEducation = await Education.findOneAndUpdate(
          { userid: _id, _id: req.query.id },
          {
            $set: {
              institutename: req.body.institutename,
              digree: req.body.digree,
              subject: req.body.subject,
              type: req.body.type,
              grade: req.body.grade,
              gradetype: req.body.type == 1 ? req.body.gradetype : "Division",
              startdate: req.body.startdate,
              enddate: req.body.enddate,
              otheractivity: req.body.otheractivity,
            },
          },
          {
            new: true,
          }
        );

        if (updateEducation != null) {
          res.status(200).json({ message: "Update successful" });
        } else {
          res.status(400).json({ message: "not found" });
        }
      }
    });
  } catch (error) {
    res.status(404).send(error);
  }
});

// skill api


app.get("/default_skill", tokenverify, async (req, res)=> {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        if(req.query.categoryid){
            var data = await Functionarea.find({categoryid: req.query.categoryid}).select('functionalname').limit(12)
            res.status(200).send(data)
        }else{
          res.status(400).json({message: "insert a category id"})
        }
        
      }
    });
  } catch (error) {
    res.status(404).send(error);
  }
})

app.post("/seeker_skill",tokenverify, async (req, res)=> {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const id = authdata._id;
        var profiledata = await Profiledata.findOneAndUpdate(
          { userid: id },
          { $set: { skill: req.body.skill } }
        );
        if (profiledata == null) {
          await Profiledata({
            userid: id,
            skill: req.body.skill,
          }).save();
          await Seekeruser.findOneAndUpdate(
            { _id: id },
            { $inc: { "other.incomplete": -1, "other.complete": 1 } }
          );
          res.status(200).json({ message: "skill add successfull data" });
        } else {
          if (profiledata.skill.length == 0) {
            await Seekeruser.findOneAndUpdate(
              { _id: id },
              { $inc: { "other.incomplete": -1, "other.complete": 1 } }
            );
          }
          res.status(200).json({ message: "skill update successfull" });
        }
      
       
        
      }
    });
  } catch (error) {
    res.status(404).send(error);
  }


  
})

// app.post("/default_skill", tokenverify, async (req, res) => {
//   try {
//     jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
//       if (err) {
//         res.json({ message: "invalid token" });
//       } else {
//         var id = authdata._id;
//         var skilldata = await DefaultSkill.findOne({
//           skill: req.body.skill,
//           userid: id,
//         });

//         if (skilldata == null) {
//           var skilldata = await DefaultSkill({
//             skill: req.body.skill,
//             userid: id,
//           });
//           skilldata.save();
//           res.status(200).json({ message: "skill add successfull data" });
//         } else {
//           res.status(400).json({ message: "skill allready added" });
//         }
//       }
//     });
//   } catch (error) {
//     res.send(error);
//   }
// });

// app.post("/seeker_skill", tokenverify, async (req, res) => {
//   try {
//     jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
//       if (err) {
//         res.json({ message: "invalid token" });
//       } else {
//         var id = authdata._id;
//         var skilldata = await Skill.findOneAndUpdate(
//           { userid: id },
//           { $addToSet: { skill: req.body.skill } }
//         );
//         if (skilldata == null) {
//           var skilldata = await Skill({ skill: req.body.skill, userid: id });
//           skilldata.save();
//           var profiledata = await Profiledata.findOneAndUpdate(
//             { userid: id },
//             { $addToSet: { skill: req.body.skill } }
//           );
//           if (profiledata == null) {
//             await Profiledata({
//               userid: id,
//               skill: req.body.skill,
//             }).save();
//             await Seekeruser.findOneAndUpdate(
//               { _id: id },
//               { $inc: { "other.incomplete": -1, "other.complete": 1 } }
//             );
//           } else {
//             if (profiledata.skill.length == 0) {
//               await Seekeruser.findOneAndUpdate(
//                 { _id: id },
//                 { $inc: { "other.incomplete": -1, "other.complete": 1 } }
//               );
//             }
//           }

//           res.status(200).json({ message: "skill add successfull data" });
//         } else {
//           var profiledata = await Profiledata.findOneAndUpdate(
//             { userid: id },
//             { $addToSet: { skill: req.body.skill } }
//           );
//           if (profiledata == null) {
//             await Profiledata({
//               userid: id,
//               skill: req.body.skill,
//             }).save();
//           }
//           res.status(400).json({ message: "skill update" });
//         }
//       }
//     });
//   } catch (error) {
//     res.send(error);
//   }
// });

// app.get("/seeker_skill", tokenverify, async (req, res) => {
//   try {
//     jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
//       if (err) {
//         res.json({ message: "invalid token" });
//       } else {
//         var id = authdata._id;
//         var defaults = [];
//         var skilldata = await Skill.findOne({ userid: id }).populate("skill");
//         var defaultskill = await DefaultSkill.find({ userid: null });
//         var defaultskill2 = await DefaultSkill.find({ userid: id });
//         defaults.push(...defaultskill);
//         defaults.push(...defaultskill2);
//         res.status(200).json({ skill: skilldata, default: defaults });
//       }
//     });
//   } catch (error) {
//     res.send(error);
//   }
// });

// app.delete("/seeker_skill", tokenverify, async (req, res) => {
//   try {
//     jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
//       if (err) {
//         res.json({ message: "invalid token" });
//       } else {
//         var id = authdata._id;
//         var skilldata = await Skill.findOneAndUpdate({
//           userid: id,
          
//         },{ $pull: { skill: req.query.id } });

//         if (skilldata == null) {
//           res.status(400).json({ message: "iteam not found" });
//         } else {
//           await Profiledata.findOneAndUpdate(
//             { userid: id },
//             { $pull: { skill: req.query.id } }
//           );
//           var skilldata = await Skill.find({ userid: id });
//           if (skilldata.length == 0) {
//             await Seekeruser.findOneAndUpdate(
//               { _id: id },
//               { $inc: { "other.incomplete": 1, "other.complete": -1 } }
//             );
//           }
//           res.status(200).json({ message: "delete successfull" });
//         }
//       }
//     });
//   } catch (error) {
//     res.send(error);
//   }
// });
// app.delete("/default_skill", tokenverify, async (req, res) => {
//   try {
//     jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
//       if (err) {
//         res.json({ message: "invalid token" });
//       } else {
//         var id = authdata._id;
//         var skilldata = await DefaultSkill.findOneAndDelete({ userid: id,_id: req.query.id});
//         if (skilldata == null) {
//           res.status(400).json({ message: "iteam not found" });
//         } else {
//           res.status(200).json({ message: "delete successfull" });
//         }
//       }
//     });
//   } catch (error) {
//     res.send(error);
//   }
// });

// app.post("/seeker_skill_update", tokenverify, async (req, res)=> {
//   try {
//     jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
//       if (err) {
//         res.json({ message: "invalid token" });
//       } else {
//         var id = authdata._id;
//         console.log(id)
//         await Skill.findOneAndUpdate({ userid: id}, {$push: {"skill.$[h]": req.body.id}}, {arrayFilters: [
//           {
//             "h": "64d20f0710c24bae1c09871e"
//           }
//         ]})
//         res.status(200).send("update")
//       }
//     });
//   } catch (error) {
//     res.send(error);
//   }
// })

// protfolio api

app.post("/protfolio", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;

        var protfolio = await Protfoliolink.findOne({
          userid: _id,
          protfoliolink: req.body.protfoliolink,
        });

        if (protfolio == null) {
          const protfoliodata = await Protfoliolink({
            protfoliolink: req.body.protfoliolink,
            userid: _id,
          });
          await protfoliodata.save();
          var profiledata = await Profiledata.findOneAndUpdate(
            { userid: _id },
            { $push: { protfoliolink: protfoliodata._id } }
          );
          if (profiledata == null) {
            await Profiledata({
              userid: _id,
              protfoliolink: protfoliodata._id,
            }).save();
            await Seekeruser.findOneAndUpdate(
              { _id: _id },
              { $inc: { "other.incomplete": -1, "other.complete": 1 } }
            );
          } else {
            if (profiledata.protfoliolink.length == 0) {
              await Seekeruser.findOneAndUpdate(
                { _id: _id },
                { $inc: { "other.incomplete": -1, "other.complete": 1 } }
              );
            }
          }

          res.status(200).json(profiledata);
        } else {
          res.status(400).json({ message: "allready added" });
        }
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/protfolio", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const singleprotfoliodata = await Protfoliolink.find({ userid: _id });
        res.status(200).send(singleprotfoliodata);
      }
    });
  } catch (error) {
    res.send(error);
  }
});

app.delete("/protfolio", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;

        const deleteData = await Protfoliolink.findOneAndDelete({
          userid: _id,
          _id: req.query.id,
        });

        if (deleteData == null) {
          res.status(400).json({ message: "iteam not found" });
        } else {
          await Profiledata.findOneAndUpdate(
            { userid: _id },
            { $pull: { protfoliolink: req.query.id } }
          );
          var skilldata = await Protfoliolink.find({ userid: _id });
          if (skilldata.length == 0) {
            await Seekeruser.findOneAndUpdate(
              { _id: _id },
              { $inc: { "other.incomplete": 1, "other.complete": -1 } }
            );
          }
          res.status(200).json({ message: "delete successfull" });
        }
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
          {_id: req.params._id ,userid: _id },
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

// careerpreference api

// get profile data

app.get("/profiledetails", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;

        var data = await Profiledata.findOne({ userid: _id }).populate([
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
              "functionalarea",
              {
                path: "division",
                populate: { path: "cityid", select: "-divisionid" },
              },
              "jobtype",
              { path: "salaray.min_salary", select: "-other_salary" },
              { path: "salaray.max_salary", select: "-other_salary" },
            ],
          },
          { path: "userid", populate: { path: "experiencedlevel" } },
        ]);
        res.status(200).send(data);
      }
    });
  } catch (error) {
    res.send(error);
  }
});





module.exports = app;
