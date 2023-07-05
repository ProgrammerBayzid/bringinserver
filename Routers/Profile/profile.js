const express = require("express");
const app = express();
const User = require("../../Model/userModel");
const tokenverify = require("../../MiddleWare/tokenverify.js");
const jwt = require("jsonwebtoken");
const Experince = require("../../Model/experience.js");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// user get

app.get("/users", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const singalUser = await User.findById(_id).populate("experiencedlevel");
        res.send(singalUser);
      }
    });
  } catch (error) {
    res.send(error);
  }
});

//   // # update user data

app.post("/users", tokenverify, upload.single("image"), async (req, res) => {

  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;

        if (req.file) {
          await User.findByIdAndUpdate(_id, {
            $set: { image: req.file.path },
          });
        }
        const updateUser = await User.findByIdAndUpdate(
          _id,
          {
            $set: {
              fastname: req.body.fastname,
              lastname: req.body.lastname,
              gender: req.body.gender,
              experiencedlevel: req.body.experiencedlevel,
              startedworking: req.body.startedworking,
              deatofbirth: req.body.deatofbirth,
              email: req.body.email,
            },
          },
          {
            new: true,
          }
        );

        res.status(200).json({ message: "update successull" });
      }
    });
  } catch (error) {
    res.status(404).send(error);
  }
});



// experience get

app.get("/experiencelist", tokenverify, (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: err });
      } else {
        var experidata = await Experince.find();
        res.json(experidata);
      }
    });
  } catch (error) {
    res.send(error);
  }
});


app.post("/notification", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const singalUser = await User.findOneAndUpdate({ _id: _id }, {
          $set: {
            "notification.push_notification": req.body.push,
            "notification.whatsapp_notification": req.body.whatsapp,
            "notification.sms_notification": req.body.sms,
            "notification.job_recommandation": req.body.job,
          }
        });
        res.status(200).json({message: "update successfull"});
      }
    });
  } catch (error) {
    res.send(error);
  }
})


app.post("/job_hunting", tokenverify, (req, res)=>{
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const singalUser = await User.findOneAndUpdate({ _id: _id }, {
          $set: {
            "job_hunting": req.body.job_hunting,
            "more_status": req.body.more_status,
            "job_right_now": req.body.job_right_now
          }
        });
        res.status(200).json({message: "update successfull"});
      }
    });
  } catch (error) {
    res.send(error);
  }
})



module.exports = app;
