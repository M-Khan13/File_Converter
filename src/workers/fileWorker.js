import { Worker } from "bullmq";
import IORedis from "ioredis";
import { convertToPDF } from "../services/convert_Service.js";
import { deleteFile } from "../utils/files_Cleanup.js";

const connection = new IORedis({
  maxRetriesPerRequest: null,
});

const worker = new Worker(
  "file-conversion",
  async (job) => {
    const { inputPath } = job.data;

    console.log("Worker processing:", inputPath);

    const outputPath = await convertToPDF(inputPath);

    await deleteFile(inputPath);

    // 🔥 Auto delete output file after 60 seconds
    setTimeout(async () => {
      try {
        await deleteFile(outputPath);
        console.log("Auto-deleted expired file:", outputPath);
      } catch (err) {
        console.error("Auto-delete error:", err.message);
      }
    }, 60 * 1000);

    return { outputPath };
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});