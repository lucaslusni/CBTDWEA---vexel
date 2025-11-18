// src/controllers/reports.controller.js
import { db } from "../lib/firebase.js";

export const summary = async (_req, res) => {
  try {
    const snap = await db.collection("vehicles").get();
    const vehicles = snap.docs.map(d => d.data());

    const total = vehicles.length;
    const ativos = vehicles.filter(v => v.status === "active").length;

    if (total === 0) {
      return res.json({
        total: 0,
        ativos: 0,
        mediaAno: 0,
        mediaKm: 0,
        maisNovo: null,
        maisAntigo: null
      });
    }

    const mediaAno = (vehicles.reduce((a, v) => a + (v.year || 0), 0) / total).toFixed(1);
    const mediaKm = (vehicles.reduce((a, v) => a + (v.mileage || 0), 0) / total).toFixed(1);

    res.json({
      total,
      ativos,
      mediaAno,
      mediaKm,
      maisNovo: Math.max(...vehicles.map(v => v.year || 0)),
      maisAntigo: Math.min(...vehicles.map(v => v.year || 9999))
    });
  } catch (err) {
    console.error("summary:", err);
    res.status(500).json({ message: "Erro ao gerar relatório" });
  }
};
