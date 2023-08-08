require("dotenv/config");
const mongoose = require("mongoose");
const app = require("./app");
const http = require("http");
const socketroute = require("./Routers/Chat/chat.io");

mongoose
  .connect(process.env.MONGODB_URL_TEST)
  .then(() => console.log("Connected to Databes"))
  .catch((err) => console.log("connection faild"));
const server = http.createServer(app);
const io = require("socket.io")(server);

app.use(socketroute);

socketroute(io);

const port = 3002;
server.listen(port, () => {
  console.log(`bringin  server is running port ${port}`);
});
