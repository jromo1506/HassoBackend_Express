const Semana = require('../models/Semana');
const express = require('express');
const router = express.Router();


// Crear una nueva semana
exports.createSemana = async (req, res) => {
    try {
        const semana = new Semana(req.body);
        await semana.save();
        res.status(201).json(semana);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener todas las semanas
exports.getSemanas = async (req, res) => {
    try {
        const semanas = await Semana.find().populate('idHorasTrabajadas');
        res.status(200).json(semanas);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Obtener una semana por ID
exports.getSemanaById = async (req, res) => {
    try {
        const semana = await Semana.findById(req.params.id).populate('idHorasTrabajadas');
        if (!semana) {
            return res.status(404).json({ error: 'Semana no encontrada' });
        }
        res.status(200).json(semana);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Actualizar una semana por ID
exports.updateSemana = async (req, res) => {
    try {
        const semana = await Semana.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!semana) {
            return res.status(404).json({ error: 'Semana no encontrada' });
        }
        res.status(200).json(semana);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Eliminar una semana por ID
exports.deleteSemana = async (req, res) => {
    try {
        const semana = await Semana.findByIdAndDelete(req.params.id);
        if (!semana) {
            return res.status(404).json({ error: 'Semana no encontrada' });
        }
        res.status(200).json({ message: 'Semana eliminada' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
