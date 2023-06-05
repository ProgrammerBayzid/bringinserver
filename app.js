const express = require("express");
const app =express();
const userRouter= require('./Routers/userRouter')
app.use(express.json());
const { User } = require("./Model/userModel");





app.get('/users/:id', async (req,res)=>{
    try {
        const _id = req.params.id;
        const singalUser = await User.findById(_id);
        console.log(singalUser);
        res.send(singalUser);
      } catch (error) {
        res.send(error);
      }
});


app.patch('/users/:id', async (req,res)=>{
    try {
        const _id = req.params.id;
        const updateUser = await User.findByIdAndUpdate(_id, req.body);
        console.log(updateUser);
        res.send(updateUser);
      } catch (error) {
        res.status(404).send(error);
      }
});





app.use('/api', userRouter)
module.exports=app
