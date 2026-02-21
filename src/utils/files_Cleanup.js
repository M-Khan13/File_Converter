import fs from "fs/promises";

export const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log(`Deleted temp file: ${filePath}`);
  } catch (err) {
    console.error("File deletion failed:", err.message);
  }
};