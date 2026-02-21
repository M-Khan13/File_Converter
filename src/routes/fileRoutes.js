import express from "express";
import upload from "../middleware/upload_Middleware.js";
import { uploadFile } from "../controllers/file_Controller.js";
import { uploadLimiter } from "../middleware/rateLimitMiddleware.js";


const router = express.Router();

router.post(
  "/upload",
  uploadLimiter,
  (req, res, next) => {
    upload.single("file")(req, res, function (err) {
      if (err) return next(err);
      next();
    });
  },
  uploadFile
);

import { Queue } from "bullmq";
import IORedis from "ioredis";
const connection = new IORedis({
  maxRetriesPerRequest: null,
});
const queue = new Queue("file-conversion", { connection });

router.get("/status/:id", async (req, res) => {
  const job = await queue.getJob(req.params.id);

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  const state = await job.getState();

  res.json({
    jobId: job.id,
    status: state,
    result: job.returnvalue || null,
  });
});

import { deleteFile } from "../utils/files_Cleanup.js";

router.get("/download/:id", async (req, res) => {
  const job = await queue.getJob(req.params.id);

  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  const state = await job.getState();

  if (state !== "completed") {
    return res.status(400).json({
      message: "File not ready for download",
    });
  }

  const { outputPath } = job.returnvalue;

  res.download(outputPath, async () => {
    console.log("File downloaded:", outputPath);

    // 🔥 delete output file after sending
    await deleteFile(outputPath);

    // 🔥 remove job from Redis
    await job.remove();
  });
});


export default router;