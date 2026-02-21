import rateLimit from "express-rate-limit";

export const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 uploads per window
  message: {
    message: "Too many uploads from this IP. Please try again later.",
  },
});