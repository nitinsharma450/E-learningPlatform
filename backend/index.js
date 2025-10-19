import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { adminRouter } from "./src/routes/adminRoutes.js";
import { connectDB } from "./connection.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/admin", adminRouter);

// Connect to DB, then start server
const PORT = process.env.PORT;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
