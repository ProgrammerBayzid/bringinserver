require('dotenv/config');
const mongoose = require('mongoose');
const app = require('./app');
const http = require('http')
const socketroute = require("./Routers/Chat/chat")

mongoose.connect(process.env.MONGODB_URL)
.then(()=>console.log('Connected to Databes'))
.catch((err)=>console.log('connection faild'))
const server = http.createServer(app)
const io = require('socket.io')(server, {
  cors: {
      origin: "*"
  }
});


app.use(socketroute)
socketroute(io)


const port = process.env.PORT || 8000;
server.listen(8000, () => {
    console.log(`bringin  server is running port ${port}`);
  });