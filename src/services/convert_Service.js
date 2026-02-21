import { exec } from "child_process";
import path from "path";
import fs from "fs/promises";

export const convertToPDF = (inputPath) => {
  return new Promise((resolve, reject) => {
    const outputDir = path.dirname(inputPath);

    const command = `soffice --headless --convert-to pdf "${inputPath}" --outdir "${outputDir}"`;

    exec(command, async (error) => {
      if (error) {
        return reject(error);
      }

      const outputFile = inputPath.replace(path.extname(inputPath), ".pdf");

      try {
        await fs.access(outputFile);
        resolve(outputFile);
      } catch {
        reject(new Error("Conversion failed"));
      }
    });
  });
};