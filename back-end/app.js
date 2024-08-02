const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const authenticate = require("./Auth/authenticate");

const { createServer } = require( 'node:http');
const { Server } = require("socket.io");

require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;
const server = createServer(app);



app.use(cors());
app.use(express.json());
const io = new Server(server, {cors: {
    origin: "http://localhost:5173"
  }});
  
mongoose
  .connect(process.env.DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

app.use("/api/signup", require("./routes/signup"));
app.use("/api/login", require("./routes/login"));
app.use("/api/user", authenticate, require("./routes/user"));
app.use("/api/users", authenticate, require("./routes/users"));

app.use("/api/refresh-token", require("./routes/refreshToken"));
app.use("/api/signout", require("./routes/signout"));
app.use("/api/todos", require("./routes/todos"));
app.use("/api/room", require("./routes/room"))

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api", (req, res) => {
  res.send("API is working");
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

server.listen(5001, ()=>{
    console.log("Web socket is listening on port 5001"); // TODO: make the port a constant.
})

io.on("connection", (socket) => {
    console.log("a user connected");
    const roomId = socket.handshake.query.room;
    socket.join(roomId);

    socket.on("newMessage", (message) => {
        // agregar un mensaje al historial del cuarto.
        io.to(roomId).emit("messageReceived", message);
    });

    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

  });