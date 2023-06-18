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

        res.status(200).json({message: "update successull"});
      }
    });
  } catch (error) {
    res.status(404).send(error);
  }
});

// experience insert

app.post("/experience", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        var experidata = await Experince.findOne({ name: req.body.name });
        if (experidata != null) {
          res.json({ message: "experience allready available" });
        } else {
          await Experince({ name: req.body.name }).save();
          res.json({ message: "experience insert successfull" });
        }
      }
    });
  } catch (error) {
    res.send(error);
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

module.exports = app;
