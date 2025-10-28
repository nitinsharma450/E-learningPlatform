import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import http from "http";
import { Server } from "socket.io";

import { connectDB } from "./connection.js";
import { adminRouter } from "./src/routes/adminRoutes.js";
import { studentRouter } from "./src/routes/studentRoutes.js";
import { ServerConfigs } from "./src/configs/ServerConfigs.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// middleware
app.use(express.json());
app.use(cors());
app.use(fileUpload());
app.use(ServerConfigs.PublicRoute, express.static(ServerConfigs.PublicFolder));

// create socket.io server
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// routes
app.use("/api/admin", adminRouter);
app.use("/api/student", studentRouter);

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);

  socket.emit("welcome", "Hello from server 👋");
});


// connect to database and start server
const PORT = process.env.PORT;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
