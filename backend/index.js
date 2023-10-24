const express = require("express");
const http = require("http");
const socket = require("socket.io");
const cors = require("cors");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
const db = require("./models/db");

// ! Router Name -------------------
const roleRouter = require("./routes/role");
const productsRouts = require("./routes/Products");
const employeeRouter = require("./routes/employee");
const userRouter = require("./routes/Users");
const socketAuth = require("./middleware/socketAuth");
const {messageHandler} = require("./controllers/message");
const conversationRouter = require("./routes/conversation");
const messageRouter = require("./routes/message");

// Router Endpoint ----------------------------
app.use("/role", roleRouter);
app.use("/employees",employeeRouter);
app.use("/products", productsRouts);
app.use("/users", userRouter);
app.use("/conversation", conversationRouter);
app.use("/messages", messageRouter);

// ! Handles any other endpoints 

app.use("*", (req, res) => res.status(404).json("NO content at this path"));


// ! Socket.io
const server = http.createServer(app);
const io = socket(server, { cors: { origin: "*" } });

let pools={};


io.use(socketAuth)

io.on("connection", (socket) => {
  const id=socket.handshake.headers.id;
  pools[id]={socket_id:socket.id,id};



messageHandler(socket,io,pools)


socket.on("disconnect",()=>{

  for (const key in pools) {
    if (pools[key].socket_id===socket.id) {
  
      delete pools[key]
    }
  }
})




  });

server.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
    console.log("===========================================");
});
