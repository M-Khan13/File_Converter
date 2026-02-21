import path from "path";
import { convertToPDF } from "../services/convert_Service.js";
import { deleteFile } from "../utils/files_Cleanup.js";


import { fileQueue } from "../queues/fileQueue.js";

export const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const ext = path.extname(req.file.originalname).toLowerCase();

    if (ext !== ".docx") {
      return res.status(400).json({
        message: "Only DOCX to PDF conversion supported currently",
      });
    }

    // 🔥 Add job to queue instead of converting
  const job = await fileQueue.add(
  "convert-docx",
  { inputPath: req.file.path },
  {
    removeOnComplete: {
      age: 60, // remove job after 60 seconds
    },
    removeOnFail: true,
  }
);

    console.log("Job added:", job.id);

    res.json({
      message: "File uploaded. Conversion started.",
      jobId: job.id,
    });

  } catch (err) {
    next(err);
  }
};