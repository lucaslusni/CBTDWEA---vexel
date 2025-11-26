import { db } from "../lib/firebase.js";
import { z } from "zod";
import { Vehicle } from "../models/vehicle.js";

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
    const snap = await col.orderBy("plate").get();
    let data = snap.docs.map(d => Vehicle.fromPlain({ id: d.id, ...d.data() }));

    if (status) data = data.filter(v => v.status === status);
    if (brand) data = data.filter(v => v.brand === brand);

    const start = (page - 1) * pageSize;
    const items = data.slice(start, start + pageSize).map(v => v.toPlain());

    res.json({ page, pageSize, count: data.length, items });
  } catch (err) {
    console.error("list:", err);
    res.status(503).json({ message: "Firestore indisponivel", detail: err && err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const ref = col.doc(req.params.id);
    const doc = await ref.get();
    if (!doc.exists) return res.status(404).json({ message: "Veiculo nao encontrado" });
    const vehicle = Vehicle.fromPlain({ id: doc.id, ...doc.data() });
    res.json(vehicle.toPlain());
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

    const vehicle = Vehicle.fromPlain({ ...data, id: data.plate, updatedAt: new Date().toISOString() });
    await ref.set(vehicle.toPlain(false));
    res.status(201).json(vehicle.toPlain());
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

    const current = Vehicle.fromPlain({ id: doc.id, ...doc.data() });
    const patch = sanitizeUpdate(req.body);
    const updated = current.withPatch(patch);

    await ref.set(updated.toPlain(false));
    res.json(updated.toPlain());
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
    const vehicles = snap.docs.map(d => Vehicle.fromPlain({ id: d.id, ...d.data() }));

    const hoje = new Date();
    const alertas = vehicles.filter(v => {
      const ano = v.year || hoje.getFullYear();
      const idade = hoje.getFullYear() - ano;
      return (v.mileage ?? 0) > 10000 || idade >= 1;
    });

    res.json({
      total: vehicles.length,
      precisandoRevisao: alertas.length,
      veiculos: alertas.map(v => v.toPlain())
    });
  } catch (err) {
    console.error("checkUp:", err);
    res.status(500).json({ message: "Erro ao gerar alertas" });
  }
};

export const efficiency = async (_req, res) => {
  try {
    const snap = await col.get();
    const vehicles = snap.docs.map(d => Vehicle.fromPlain({ id: d.id, ...d.data() }));

    const data = vehicles.map(v => {
      const km = v.mileage ?? 0;
      const litros = km / 10 + Math.random() * 50;
      const consumo = km / litros;
      return {
        ...v.toPlain(),
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
