const express = require("express");
const app = express();
const multer = require("multer");

const {
  AdminCompanySize, AdminSkill,  JobTitle,Department,SeekeraddCompany, Image,Cv
} = require("../../Model/adminprofiledetails");
const { City, Division } = require("../../Model/alllocation.js");
const Experince = require("../../Model/experience.js");


const tokenverify = require("../../MiddleWare/tokenverify.js");
const jwt = require("jsonwebtoken");



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname);
  },
});
const image = multer({ storage: storage });



app.post("/admin_exprience", async (req, res) => {
  try {
    const Data = await Experince(req.body);
    const ex = await Data.save()
    res.status(200).send(ex);
  } catch (error) {
    res.status(400).send(error);
  }
});


app.get("/admin_exprience", async (req, res) => {
  try {
    const data = await Experince.find();
    res.send(data);
  } catch (error) {
    res.send(error);
  }
});

app.delete("/admin_exprience/:id", async (req, res) => {
  try {
    const result = await Experince.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      return res.status(404).send();
    }
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

 // # post designation data 

app.post("/jobtitle", async (req, res) => {
    try {
      const designationData = await JobTitle(req.body);
      const data = await designationData.save()
      res.status(200).send(data);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  // # get designation data 
  
  app.get("/jobtitle", async (req, res) => {
    try {
      const data = await JobTitle.find();
      res.send(data);
    } catch (error) {
      res.send(error);
    }
  });
  app.delete("/jobtitle/:id", async (req, res) => {
    try {
      const result = await JobTitle.findByIdAndDelete(req.params.id);
      if (!req.params.id) {
        return res.status(404).send();
      }
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  });



  
 // # post department data 
 
app.post("/department", async (req, res) => {
    try {
      const departmentData = await Department(req.body);
      const data = await departmentData.save()
      res.status(200).send(data);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  // # get department data 
  
  app.get("/department", async (req, res) => {
    try {
      const data = await Department.find();
      res.send(data);
    } catch (error) {
      res.send(error);
    }
  });
  app.delete("/department/:id", async (req, res) => {
    try {
      const result = await Department.findByIdAndDelete(req.params.id);
      if (!req.params.id) {
        return res.status(404).send();
      }
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  });


  
 // # post institutename data 
 
app.post("/admincompanysize", async (req, res) => {
    try {
      const admincompanysizeData = await AdminCompanySize(req.body);
      const data = await admincompanysizeData.save()
      res.status(200).send(data);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  // # get Institutename data 
  
  app.get("/admincompanysize", async (req, res) => {
    try {
      const admincompanysizeData = await AdminCompanySize.find();
      res.send(admincompanysizeData);
    } catch (error) {
      res.send(error);
    }
  });
  app.delete("/admincompanysize/:id", async (req, res) => {
    try {
      const result = await AdminCompanySize.findByIdAndDelete(req.params.id);
      if (!req.params.id) {
        return res.status(404).send();
      }
      res.send(result);
    } catch (error) {
      res.send(error);
    }
  });
  


  


  
 // # post company data 
 
 app.post("/seekercompany", async (req, res) => {
  try {
    const companyData = await SeekeraddCompany(req.body);
    const data = await companyData.save()
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

// # get company data 

app.get("/seekercompany", async (req, res) => {
  try {
    const data = await SeekeraddCompany.find();
    res.send(data);
  } catch (error) {
    res.send(error);
  }
});
app.delete("/seekercompany/:id", async (req, res) => {
  try {
    const result = await SeekeraddCompany.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      return res.status(404).send();
    }
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});

// image post api 

app.post("/image", tokenverify, image.single("image"), async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const imagedata = await Image({
          image: req.file.path,
          userid: _id,
        });
        const imagefile = await imagedata.save();
        res.status(200).send(imagefile);
      }
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

// image get api


app.get("/image/:_id", tokenverify, async (req, res) => {
  try {
    jwt.verify(req.token, process.env.ACCESS_TOKEN, async (err, authdata) => {
      if (err) {
        res.json({ message: "invalid token" });
      } else {
        const _id = authdata._id;
        const data = await Image.findOne({ userid: _id });
        res.send(data);
      }
    });
  } catch (error) {
    res.send(error);
  }
});


app.post("/admin/skill", async (req, res) => {
  try {
    const skillData = await AdminSkill(req.body);
    const data = await skillData.save()
    res.status(200).send(data);
  } catch (error) {
    res.status(400).send(error);
  }
});

// # get skill data 

app.get("/admin/skill", async (req, res) => {
  try {
    const data = await AdminSkill.find();
    res.send(data);
  } catch (error) {
    res.send(error);
  }
});


app.delete("/admin/skill/:id", async (req, res) => {
  try {
    const result = await AdminSkill.findByIdAndDelete(req.params.id);
    if (!req.params.id) {
      return res.status(404).send();
    }
    res.send(result);
  } catch (error) {
    res.send(error);
  }
});





module.exports = app;
