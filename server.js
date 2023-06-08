require('dotenv/config');
const mongoose = require('mongoose');
const app = require('./app');

mongoose.connect(process.env.MONGODB_URL)
.then(()=>console.log('Connected to Databes'))
.catch((err)=>console.log('connection faild'))

const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`bringin  server is running port ${port}`);
  });