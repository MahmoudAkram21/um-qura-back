/**
 * Agricultural Calendar & Stars - Backend entry point.
 */
import "dotenv/config";
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";

const app = express();
const PORT = process.env.PORT ?? 4000;

// CORS: use env or allow all in dev
const corsOrigin = process.env.CORS_ORIGIN;
app.use(
  cors({
    origin: corsOrigin === "*" || !corsOrigin ? true : corsOrigin.split(",").map((o) => o.trim()),
    credentials: true,
  })
);

app.use(express.json());

// API
app.use("/api", routes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "agricultural-calendar-api" });
});

// 404
app.use(notFound);

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
