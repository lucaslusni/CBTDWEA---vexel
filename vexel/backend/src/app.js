import express from "express";
import cors from "cors";
import vehiclesRouter from "./routes/vehicles.routes.js";
import reportsRouter from "./routes/reports.routes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/vehicles", vehiclesRouter);
app.use("/reports", reportsRouter);

// Global error handler to avoid crashes
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Erro interno" });
});

export default app;
