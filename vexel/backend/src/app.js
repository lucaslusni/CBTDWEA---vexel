import express from "express";
import cors from "cors";
import vehiclesRouter from "./routes/vehicles.routes.js";
import reportsRouter from "./routes/reports.routes.js";

const app = express();
app.use(cors()); // libera CORS para o frontend
app.use(express.json()); // parse de JSON no body

app.get("/health", (_req, res) => res.json({ status: "ok" })); // endpoint de liveness
app.use("/vehicles", vehiclesRouter); // CRUD e análises de veículos
app.use("/reports", reportsRouter); // relatórios agregados

// Global error handler to avoid crashes
app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Erro interno" });
});

export default app;
