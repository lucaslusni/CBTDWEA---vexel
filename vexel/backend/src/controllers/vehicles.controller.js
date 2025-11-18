import { db } from "../lib/firebase.js";
import { z } from "zod";

const col = db.collection("vehicles");

const vehicleSchema = z.object({
  plate: z.string().trim().min(1, "plate obrigatorio"),
  model: z.string().trim().min(1, "model obrigatorio"),
  brand: z.string().trim().min(1, "brand obrigatorio"),
  year: z.number().int().positive("year invalido"),
  status: z.string().trim().default("active"),
  mileage: z.number().nonnegative().default(0)
});

const vehicleUpdateSchema = vehicleSchema.partial().omit({ plate: true });

const sanitize = (data) => vehicleSchema.parse(data);
const sanitizeUpdate = (data) => vehicleUpdateSchema.parse(data);

export const list = async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const pageSize = Math.min(Math.max(Number(req.query.pageSize) || 10, 1), 50);
  const status = req.query.status ? String(req.query.status).trim() : null;
  const brand = req.query.brand ? String(req.query.brand).trim() : null;

  try {
    // Estratégia simples: buscar ordenado por placa e filtrar em memória (volume pequeno)
    const snap = await col.orderBy("plate").get();
    let data = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    if (status) data = data.filter(d => d.status === status);
    if (brand) data = data.filter(d => d.brand === brand);

    const start = (page - 1) * pageSize;
    const items = data.slice(start, start + pageSize);

    res.json({
      page,
      pageSize,
      count: data.length,
      items
    });
  } catch (err) {
    console.error("list:", err);
    res.status(503).json({ message: "Firestore indisponivel", detail: err?.message });
  }
};

export const getById = async (req, res) => {
  try {
    const ref = col.doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ message: "Veiculo nao encontrado" });
    res.json({ id: doc.id, ...doc.data() });
  } catch (err) {
    console.error("getById:", err);
    res.status(503).json({ message: "Firestore indisponivel" });
  }
};

export const create = async (req, res) => {
  try {
    const data = sanitize(req.body);

    const ref = col.doc(data.plate);
    const exists = await ref.get();
    if (exists.exists) return res.status(409).json({ message: "Placa ja cadastrada" });

    await ref.set({ ...data, updatedAt: new Date().toISOString() });
    const created = await ref.get();
    res.status(201).json({ id: created.id, ...created.data() });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: "Payload invalido", issues: err.issues });
    }
    console.error("create:", err);
    res.status(503).json({ message: "Firestore indisponivel" });
  }
};

export const update = async (req, res) => {
  try {
    const ref = col.doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ message: "Veiculo nao encontrado" });

    const patch = sanitizeUpdate(req.body);
    await ref.update({ ...patch, updatedAt: new Date().toISOString() });

    const updated = await ref.get();
    res.json({ id: updated.id, ...updated.data() });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({ message: "Payload invalido", issues: err.issues });
    }
    console.error("update:", err);
    res.status(503).json({ message: "Firestore indisponivel" });
  }
};

export const remove = async (req, res) => {
  try {
    const ref = col.doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ message: "Veiculo nao encontrado" });
    await ref.delete();
    res.status(204).send();
  } catch (err) {
    console.error("remove:", err);
    res.status(503).json({ message: "Firestore indisponivel" });
  }
};

export const checkUp = async (_req, res) => {
  try {
    const snap = await col.get();
    const vehicles = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    const hoje = new Date();
    const alertas = vehicles.filter(v => {
      const ano = v.year || hoje.getFullYear();
      const idade = hoje.getFullYear() - ano;
      const precisaRevisao = (v.mileage ?? 0) > 10000 || idade >= 1;
      return precisaRevisao;
    });

    res.json({
      total: vehicles.length,
      precisandoRevisao: alertas.length,
      veiculos: alertas
    });
  } catch (err) {
    console.error("checkUp:", err);
    res.status(500).json({ message: "Erro ao gerar alertas" });
  }
};

export const efficiency = async (_req, res) => {
  try {
    const snap = await col.get();
    const vehicles = snap.docs.map(d => ({ id: d.id, ...d.data() }));

    const data = vehicles.map(v => {
      const km = v.mileage ?? 0;
      const litros = km / 10 + Math.random() * 50; // simula historico
      const consumo = km / litros;
      return {
        ...v,
        consumoMedio: consumo.toFixed(2),
        alerta: consumo < 8 ? "baixo consumo" : null
      };
    });

    res.json({
      total: data.length,
      alertas: data.filter(d => d.alerta),
      veiculos: data
    });
  } catch (err) {
    console.error("efficiency:", err);
    res.status(500).json({ message: "Erro ao calcular consumo" });
  }
};
