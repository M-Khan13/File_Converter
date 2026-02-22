import express from "express";
import dotenv from "dotenv";

dotenv.config();
import fileRoutes from "./src/routes/fileRoutes.js";    
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use("/api/files", fileRoutes);
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  console.log("Root route hit");
  res.send("File Converter API Running");
});

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "client")));


import { errorHandler } from "./src/middleware/error_Middleware.js";

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});