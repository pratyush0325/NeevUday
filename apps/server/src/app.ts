import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes";
import donationRoutes from "./routes/donation.routes";
import villageRoutes from "./routes/village.routes";
import ngoRoutes from "./routes/ngo.routes";
import workerRoutes from "./routes/worker.routes";
import platformRoutes from "./routes/platform.routes";
import { errorHandler } from "./middleware/error.middleware";
import { notFound } from "./middleware/notFound.middleware";

const app = express();

// ─── Global Middleware ────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:3000", credentials: true }));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => res.json({ status: "ok", service: "setu-api" }));

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/villages", villageRoutes);
app.use("/api/ngos", ngoRoutes);
app.use("/api/workers", workerRoutes);
app.use("/api/platform", platformRoutes);

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
