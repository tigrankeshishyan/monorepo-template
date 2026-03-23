import express, { type Express } from "express";
import cors from "cors";
import helmet from "helmet";
import { healthRouter } from "./routes/health";
import { authRouter } from "./routes/auth";

export function createHttpApp(): Express {
  const app = express();

  // ─── Security middleware ─────────────────────────────────────────────────────
  app.use(helmet());

  const allowedOrigins = (process.env["ALLOWED_ORIGINS"] ?? "http://localhost:5173")
    .split(",")
    .map((o) => o.trim());

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`CORS: origin ${origin} not allowed`));
        }
      },
      credentials: true,
    }),
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  // ─── Routes ───────────────────────────────────────────────────────────────────
  app.use("/health", healthRouter);
  app.use("/auth", authRouter);

  // ─── 404 handler ──────────────────────────────────────────────────────────────
  app.use((req, res) => {
    void req;
    res.status(404).json({ error: "Not found" });
  });

  return app;
}
