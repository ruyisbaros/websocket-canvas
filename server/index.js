require("dotenv").config();
const express = require("express");
const http = require("http");
const morgan = require("morgan");
const cors = require("cors");
const { Server } = require("socket.io");
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "PUT", "POST", "DELETE"],
  },
});
let elements = [];
io.on("connection", (socket) => {
  console.log("User connected");
  io.to(socket.id).emit("Whiteboard-state", elements);

  socket.on("element-update", (element) => {
    updateElementInElements(element);
    socket.broadcast.emit("element-update", element);
  });

  socket.on("clear-box", () => {
    elements = [];
    socket.broadcast.emit("clear-box");
  });

  socket.on("cursor-position", (data) => {
    socket.broadcast.emit("cursor-position", {
      ...data,
      userId: socket.id,
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("user-disconnected", socket.id);
  });
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server runs at port: ${port}...`);
});

const updateElementInElements = (el) => {
  const index = elements.findIndex((item) => item.id === el.id);
  if (index === -1) {
    elements.push(el);
    return elements;
  } else {
    elements[index] = el;
    return elements;
  }
};
