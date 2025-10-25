import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { adminRouter } from "./src/routes/adminRoutes.js";
import { connectDB } from "./connection.js";
import fileUpload from 'express-fileupload'
import { ServerConfigs } from "./src/configs/ServerConfigs.js";
import { studentRouter } from "./src/routes/studentRoutes.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload())
app.use(ServerConfigs.PublicRoute, express.static(ServerConfigs.PublicFolder));

// Routes
app.use("/api/admin", adminRouter);
app.use('/api/student',studentRouter)

// Connect to DB, then start server
const PORT = process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
