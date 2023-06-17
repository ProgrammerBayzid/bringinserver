const express = require("express");
const app = express();

const {
    Designation,Department,Institutename,MajorinSubject,Educationleveldegree
} = require("../../Model/adminprofiledetails");

const tokenverify = require("../../MiddleWare/tokenverify.js");
const jwt = require("jsonwebtoken");


 // # post designation data 

app.post("/designation", async (req, res) => {
    try {
      const designationData = await Designation(req.body);
      const data = await designationData.save()
      res.status(200).send(data);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  // # get designation data 
  
  app.get("/designation", async (req, res) => {
    try {
      const designationData = await Designation.find();
      res.send(designationData);
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
      const departmentData = await Department.find();
      res.send(departmentData);
    } catch (error) {
      res.send(error);
    }
  });


  
 // # post institutename data 
 
app.post("/institutename", async (req, res) => {
    try {
      const institutenameData = await Institutename(req.body);
      const data = await institutenameData.save()
      res.status(200).send(data);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  // # get Institutename data 
  
  app.get("/institutename", async (req, res) => {
    try {
      const institutenameData = await Institutename.find();
      res.send(institutenameData);
    } catch (error) {
      res.send(error);
    }
  });
  
 // # post MajorinSubject data 
 
app.post("/majorinSubject", async (req, res) => {
    try {
      const majorinSubjectData = await MajorinSubject(req.body);
      const data = await majorinSubjectData.save()
      res.status(200).send(data);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  // # get MajorinSubject data 
  
  app.get("/majorinsubject", async (req, res) => {
    try {
      const majorinSubjectData = await MajorinSubject.find();
      res.send(majorinSubjectData);
    } catch (error) {
      res.send(error);
    }
  });
  
 // # post Educationleveldegree data 
 
app.post("/educationleveldegree", async (req, res) => {
    try {
      const educationleveldegreeData = await Educationleveldegree(req.body);
      const data = await educationleveldegreeData.save()
      res.status(200).send(data);
    } catch (error) {
      res.status(400).send(error);
    }
  });
  
  // # get Educationleveldegree data 
  
  app.get("/educationleveldegree", async (req, res) => {
    try {
      const educationleveldegreeData = await Educationleveldegree.find();
      res.send(educationleveldegreeData);
    } catch (error) {
      res.send(error);
    }
  });








module.exports = app;
