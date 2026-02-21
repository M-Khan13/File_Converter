export const errorHandler = (err, req, res, next) => {
  console.error("Global Error:", err.message);

  // Multer file size error
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      message: "File too large. Max size is 10MB.",
    });
  }

  // Multer invalid file type
  if (err.message === "Unsupported file type") {
    return res.status(400).json({
      message: err.message,
    });
  }

  // Default fallback
  res.status(500).json({
    message: err.message || "Internal Server Error",
  });
};