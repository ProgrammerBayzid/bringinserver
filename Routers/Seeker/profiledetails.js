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
} = require("../../Model/Seeker_profile_all_details.js");

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
        const aboutdata = await About.findOneAndUpdate({ userid: _id }, { $set: { about: req.body.about } })
        if (aboutdata == null) {
          const about = await About({
            about: req.body.about,
            userid: _id,
          });
          about.save();
          var profiledata = await Profiledata.findOneAndUpdate({ userid: _id }, { $set: { aboutid: about._id } })
          if (profiledata == null) {
            await Profiledata({
              userid: _id,
              aboutid: about._id
            }).save()
          }
          res.status(200).json({ message: "add successfull" });
        } else {
          console.log(aboutdata._id)
          var profiledata = await Profiledata.findOneAndUpdate({ userid: _id }, { $set: { about: aboutdata._id } })
          if (profiledata == null) {
            await Profiledata({
              userid: _id,
              about: aboutdata._id
            }).save()
          }
          res.status(200).json({ message: "update successfull" });
        }
        // const aboutdata = await About({
        //   about: req.body.about,
        //   userid: _id,
        // });
        // const siabout = await aboutdata.save();
        // const aboutid = About.findById(_id);
        // const dataid = aboutid._conditions._id;
        // const id = await Profiledata({ aboutid: dataid });
        // const allaboutdata = await id.save();
        // console.log(dataid);
        // res.status(200).send(siabout);
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

      var workdata = await Workexperience.findOne({ userid: _id, companyname: req.body.companyname })

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
        var profiledata = await Profiledata.findOneAndUpdate({ userid: _id }, { $push: { workexperience: workexperiencedata._id } })
        if (profiledata == null) {
          await Profiledata({
            userid: _id,
            aboutid: workexperiencedata._id
          }).save()
        }
        res.status(200).json({ message: "Add Successfull" });
      } else {
        res.status(400).json({ message: "All ready Added" })
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
          userid: _id
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
        var data = await Workexperience.findOneAndDelete({ userid: user, _id: req.query.id });
        //  await Profiledata.findOneAndUpdate({ userid: user }, { $pull: { "workexperience": req.query.id } })

        if (data == null) {
          res.status(400).json({ message: "iteam not found" });
        } else {
          await Profiledata.findOneAndUpdate({ userid: user }, { $pull: { "workexperience": req.query.id } })
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

        const edudata = await Education.findOne({ userid: _id, digree: req.body.digree })
        if (edudata == null) {
          const educationdata = await Education({
            institutename: req.body.institutename,
            digree: req.body.digree,
            subject: req.body.subject,
            grade: req.body.grade,
            startdate: req.body.startdate,
            enddate: req.body.enddate,
            otheractivity: req.body.otheractivity,
            userid: _id,
          });
          educationdata.save();
          var profiledata = await Profiledata.findOneAndUpdate({ userid: _id }, { $push: { education: educationdata._id } })
          if (profiledata == null) {
            await Profiledata({
              userid: _id,
              education: educationdata._id
            }).save()
          }
          res.status(200).json({ message: "Education Add Successfull" })
        } else {
          res.status(400).json({ message: "already added" })
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
        const singleeducationdata = await Education.find({ userid: _id }).populate([{ path: "digree", select: "-subject" }, "subject"]);
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
        await Profiledata.findOneAndUpdate({ userid: _id }, { $pull: { "education": req.query.id } })

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
              grade: req.body.grade,
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



app.post("/seeker_skill", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" })
      } else {
        var id = authdata._id;
        var skilldata = await Skill.findOne({ skill: req.body.skill, userid: id })

        if (skilldata == null) {
          var skilldata = await Skill({ skill: req.body.skill, userid: id });
          skilldata.save();
          var profiledata = await Profiledata.findOneAndUpdate({ userid: id }, { $push: { skill: skilldata._id } })
          if (profiledata == null) {
            await Profiledata({
              userid: id,
              skill: skilldata._id
            }).save()
          }
          res.status(200).json({ message: "skill add successfull data" })
        } else {
          res.status(400).json({ message: "skill allready added" })
        }

      }
    })

  } catch (error) {
    res.send(error);
  }
})


app.get("/seeker_skill", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" })
      } else {
        var id = authdata._id;
        var skilldata = await Skill.find({ userid: id })
        res.status(200).send(skilldata)
      }
    })

  } catch (error) {
    res.send(error);
  }
})


app.delete("/seeker_skill",tokenverify, async (req, res)=> {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" })
      } else {
        var id = authdata._id;
        var skilldata = await Skill.findOneAndDelete({ userid: id, _id: req.query.id })
        
        if(skilldata == null){
          res.status(400).json({message: "iteam not found"})
        }else{
          await Profiledata.findOneAndUpdate({ userid: id }, { $pull: { skill: req.query.id } })
          res.status(200).json({message: "delete successfull"})
        }
        
      }
    })

  } catch (error) {
    res.send(error);
  }
})


// app.post("/skill", tokenverify, async (req, res) => {
//   try {
//     jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
//       if (err) {
//         res.json({ message: "invalid token" });
//       } else {
//         const _id = authdata._id;
//         const skilldata = await Skill({
//           skillname: req.body.skillname,
//           userid: _id,
//         });
//         const skill = await skilldata.save();

//         const skillid = Skill.findById(_id);
//         // console.log(skillid);
//         const dataid = skillid.schema.paths._id;
//         // const id = await Profiledata(dataid);
//         // const allskilldata = await id.save();
//         console.log(dataid);
//         res.status(200).send(skill);
//       }
//     });
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// app.get("/skill/:_id", tokenverify, async (req, res) => {
//   try {
//     jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
//       if (err) {
//         res.json({ message: "invalid token" });
//       } else {
//         const _id = authdata._id;
//         const singleskilldata = await Skill.find({ userid: _id });
//         res.send(singleskilldata);
//       }
//     });
//   } catch (error) {
//     res.send(error);
//   }
// });

// app.delete("/skill/:_id", tokenverify, async (req, res) => {
//   try {
//     jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
//       if (err) {
//         res.json({ message: "invalid token" });
//       } else {
//         const user = authdata._id;
//         const _id = { userid: user };
//         const deleteData = await Skill.findOneAndDelete(_id);
//         if (!_id) {
//           return res.status(400).send();
//         }
//         res.send(deleteData);
//       }
//     });
//   } catch (error) {
//     res.send(error);
//   }
// });
// app.patch("/skill/:_id", tokenverify, async (req, res) => {
//   try {
//     jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
//       if (err) {
//         res.json({ message: "invalid token" });
//       } else {
//         const _id = authdata._id;
//         const updateskill = await Skill.findOneAndUpdate(
//           { userid: _id },
//           {
//             $set: {
//               skillname: req.body.skillname,
//             },
//           },
//           {
//             new: true,
//           }
//         );

//         res.send(updateskill);
//       }
//     });
//   } catch (error) {
//     res.status(404).send(error);
//   }
// });

// protfolio api

app.post("/protfolio", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
         
        var protfolio = await Protfoliolink.findOne({userid: _id, protfoliolink: req.body.protfoliolink})
        
        if(protfolio == null){
          const protfoliodata = await Protfoliolink({
            protfoliolink: req.body.protfoliolink,
            userid: _id,
          });
          protfoliodata.save();
          var profiledata = await Profiledata.findOneAndUpdate({ userid: _id }, { $push: { protfoliolink: protfoliodata._id } })
          if (profiledata == null) {
            await Profiledata({
              userid: _id,
              skill: protfoliodata._id
            }).save()
          }
          res.status(200).json({message: "add successfull"})
        }else{
          res.status(400).json({message: "allready added"})
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
     
        const deleteData = await Protfoliolink.findOneAndDelete({userid: _id, _id: req.query.id});
        
        if (deleteData == null) {
          res.status(400).json({message: "iteam not found"})
        }else{
          await Profiledata.findOneAndUpdate({ userid: _id }, { $pull: { protfoliolink: req.query.id } })
          res.status(200).json({message: "delete successfull"})

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


// careerpreference api

// app.post("/careerpreference", tokenverify, async (req, res) => {
//   try {
//     jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
//       if (err) {
//         res.json({ message: "invalid token" });
//       } else {
//         const _id = authdata._id;
//         const careerpreferencedata = await CareerPreference({
//           expectedjobindustry: req.body.expectedjobindustry,
//           expertisearea: req.body.expertisearea,
//           expectedjoblocation: req.body.expectedjoblocation,
//           jobtype: req.body.jobtype,
//           expectedsalary: req.body.expectedsalary,
//           userid: _id,
//         });
//         const careerpreference = await careerpreferencedata.save();
//         const careerpreferenceid = CareerPreference.findById(_id);
//         const dataid = careerpreferenceid._conditions._id;
//         const id = await Profiledata({ careerPreferenceid: dataid });
//         const allcareerpreferencedata = await id.save();
//         console.log(dataid);
//         res.status(201).send(careerpreference);
//       }
//     });
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// app.get("/careerpreference/:_id", tokenverify, async (req, res) => {
//   try {
//     jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
//       if (err) {
//         res.json({ message: "invalid token" });
//       } else {
//         const _id = authdata._id;
//         const singleCareerPreferencedata = await CareerPreference.find({
//           userid: _id,
//         });
//         res.send(singleCareerPreferencedata);
//       }
//     });
//   } catch (error) {
//     res.send(error);
//   }
// });

// app.delete("/careerpreference/:_id", tokenverify, async (req, res) => {
//   try {
//     jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
//       if (err) {
//         res.json({ message: "invalid token" });
//       } else {
//         const user = authdata._id;
//         const _id = { userid: user };
//         const deleteData = await CareerPreference.findOneAndDelete(_id);
//         if (!_id) {
//           return res.status(400).send();
//         }
//         res.send(deleteData);
//       }
//     });
//   } catch (error) {
//     res.send(error);
//   }
// });

// app.patch("/careerpreference/:_id", tokenverify, async (req, res) => {
//   try {
//     jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
//       if (err) {
//         res.json({ message: "invalid token" });
//       } else {
//         const _id = authdata._id;
//         const update = await CareerPreference.findOneAndUpdate(
//           { userid: _id },
//           {
//             $set: {
//               expectedjobindustry: req.body.expectedjobindustry,
//               expertisearea: req.body.expertisearea,
//               expectedjoblocation: req.body.expectedjoblocation,
//               jobtype: req.body.jobtype,
//               expectedsalary: req.body.expectedsalary,
//             },
//           },
//           {
//             new: true,
//           }
//         );

//         res.send(update);
//       }
//     });
//   } catch (error) {
//     res.status(404).send(error);
//   }
// });

// get profile data

app.get("/profiledetails",tokenverify, async (req, res) => {
   

  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
     
        var data = await Profiledata.find({userid: _id}).populate(
          [
            {path: "workexperience",populate:[{path: "category", select: "-functionarea"},"expertisearea"] },
            {path: "education",populate: [{path: "digree",select: "-subject"},"subject"]},
            "skill",
            "protfoliolink",
            "about",
            {path: "careerPreference",populate: [{path: "category",select: "-functionarea"},"functionalarea","division","jobtype","salaray"]},
            {path:"userid", populate: {path: "experiencedlevel"}}
          ]
        );
        res.status(200).send(data)
      }
    });
  } catch (error) {
    res.send(error);
  }



});

module.exports = app;
