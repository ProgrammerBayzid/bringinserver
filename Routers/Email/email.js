const express = require("express");
const app = express();
const bcrypt = require("bcrypt");

const email = require("../../Model/emaillogin.js");

// app.post("/signup", (req, res) => {
//   let { name, email, password } = req.body;
//   name = name.trim();
//   email = email.trim();
//   password = password.trim();
//   if (name == "" || email == "" || password == "") {
//     res.json({
//       status: "FAILD",
//       message: "Empty input fields!",
//     });
//   } else if (password.length < 8) {
//     res.json({
//       status: "FAILD",
//       message: "Password is too short!",
//     });
//   } else {
//     Email.find({ email })
//       .then((result) => {
//         if (result.length) {
//           res.json({
//             status: "FAILD",
//             message: "User with this email already exists!",
//           });
//         } else {
//           const saltRounds = 10;
//           bcrypt
//             .hash(password, saltRounds)
//             .then((hashedPassword) => {
//               const newUser = Email({
//                 name,
//                 email,
//                 password: hashedPassword,
//               });
//               newUser
//                 .save()
//                 .then((result) => {
//                   res.json({
//                     status: "FAILD",
//                     message: "Singup successful",
//                     data: result,
//                   });
//                 })
//                 .catch((err) => {
//                   console.log(err);
//                   res.json({
//                     status: "FAILD",
//                     message: "An error occurred while user account!",
//                   });
//                 });
//             })
//             .catch((err) => {
//               console.log(err);
//               res.json({
//                 status: "FAILD",
//                 message: "An error occurred while hashing password!",
//               });
//             });
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         res.json({
//           status: "FAILD",
//           message: "An error occurred while checking for exists user!",
//         });
//       });
//   }
// });

// app.post("/signin", (req, res) => {
//   let { email, password } = req.body;

//   email = email.trim();
//   password = password.trim();
//   if (email == "" || password == "") {
//     res.json({
//       status: "FAILD",
//       message: "Empty input fields!",
//     });
//   } else {
//     Email.find({ email })
//       .then((data) => {
//         if (data.length) {
//           const hashedPassword = data[0].password;
//           bcrypt
//             .compare(password, hashedPassword)
//             .then((result) => {
//               if (result) {
//                 res.json({
//                   status: "Success",
//                   message: "Signin successful",
//                   data: data,
//                 });
//               } else {
//                 res.json({
//                   status: "Failed",
//                   message: "Invalid password",
//                 });
//               }
//             })
//             .catch((err) => {
//               console.log(err);
//               res.json({
//                 status: "FAILD",
//                 message: "An error occurred while comparing passwords",
//               });
//             });
//         } else {
//           res.json({
//             status: "FAILD",
//             message: "Invalid credentials entered",
//           });
//         }
//       })
//       .catch((err) => {
//         console.log(err);
//         res.json({
//           status: "FAILD",
//           message: "An error occurred while checking forexisting user",
//         });
//       });
//   }
// });

// app.get("/email/user", async (req, res) => {
//   try {
//     const email = req.query.email;
//     const query = { email: email };
//     const userData = await Email.find(query);
//     res.send(userData);
//   } catch (error) {
//     res.send(error);
//   }
// });

app.post("/emailsingup", async (req, res) => {
  const adminUser = await email(req.body);
  const data = await adminUser.save();
  res.json(data);
  console.log(data);

  // res.send(error);
});

// context user
app.get("/user", async (req, res) => {
  const email = req.query.email;
  const query = { email: email };
  const users = await email.findOne(query);
  res.send(users);
  console.log(users);
});

module.exports = app;

// { displayName: req.body.displayName },
// { email: req.body.email },
// { photoURL: req.body.photoURL },
// { appAdmin: req.body.appAdmin },
// { webAdmin: req.body.webAdmin }
// , { message: "user successfull" }
