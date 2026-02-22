import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import fileRoutes from "./src/routes/fileRoutes.js";
import { errorHandler } from "./src/middleware/error_Middleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Required for ES Modules to use __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());

// 🔥 Serve Frontend (IMPORTANT: before routes)
app.use(express.static(path.join(__dirname, "client")));

// API Routes
app.use("/api/files", fileRoutes);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});