// src/controllers/reports.controller.js
import { db } from "../lib/firebase.js";

// Controller responsável por gerar um resumo (summary) dos veículos cadastrados
export const summary = async(_req, res) => {
    try {
        // Lê todos os documentos da coleção "vehicles" no Firestore
        const snap = await db.collection("vehicles").get(); // le todos os veiculos para agregar
        // Converte os documentos em objetos JS
        const vehicles = snap.docs.map(d => d.data());

        // Quantidade total de veículos
        const total = vehicles.length;
        // Quantos veículos estão com status "active"
        const ativos = vehicles.filter(v => v.status === "active").length;

        // Se não houver veículos cadastrados, retorna tudo zerado / nulo
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

        // Calcula a média do ano de fabricação dos veículos (ignorando undefined com || 0)
        const mediaAno = (vehicles.reduce((a, v) => a + (v.year || 0), 0) / total).toFixed(1);
        // Calcula a média de quilometragem dos veículos
        const mediaKm = (vehicles.reduce((a, v) => a + (v.mileage || 0), 0) / total).toFixed(1);

        // Responde com o resumo agregado
        res.json({
            total, // total de veículos
            ativos, // quantos estão ativos
            mediaAno, // média de ano de fabricação
            mediaKm, // média de km rodados
            maisNovo: Math.max(...vehicles.map(v => v.year || 0)), // ano do veículo mais novo
            maisAntigo: Math.min(...vehicles.map(v => v.year || 9999)) // ano do veículo mais antigo
        });
    } catch (err) {
        // Em caso de erro inesperado, loga e devolve 500
        console.error("summary:", err);
        res.status(500).json({ message: "Erro ao gerar relatório" });
    }
};